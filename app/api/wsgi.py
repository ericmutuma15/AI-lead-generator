from datetime import datetime, timedelta
from functools import wraps
import os
import random
import re
from typing import Any

import jwt
from flask import Flask, jsonify, request, g
from flask_cors import CORS
from flask_migrate import Migrate

from config import Config
from models import (
    AuditLog,
    Interaction,
    Lead,
    Message,
    Notification,
    RefreshToken,
    SocialAccount,
    User,
    WebhookEvent,
    db,
)

app = Flask(__name__)
app.config.from_object(Config)
CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)
db.init_app(app)
Migrate(app, db)

application = app

FAILED_LOGIN_ATTEMPTS = {}


def create_app() -> Flask:
    return app


def _seed_demo_data() -> None:
    if Lead.query.count() > 0:
        return

    names = [
        "Amina Hassan", "John Mwangi", "Sarah Kimani", "Peter Otieno", "Grace Wanjiru",
        "David Njoroge", "Lucy Muthoni", "Brian Ochieng", "Mary Atieno", "Samuel Kiptoo",
    ]
    interests = ["Order Tracking", "Product Inquiry", "Support", "Custom Quote", "Partnership"]
    budgets = ["KES 2,000 - 5,000", "KES 5,000 - 10,000", "KES 10,000+", "KES 500 - 1,000"]
    sources = ["Web", "WhatsApp", "Referral", "Facebook", "Instagram"]
    statuses = ["New", "Qualified", "Converted"]

    for index, name in enumerate(names):
        lead = Lead(
            business_id="biz1",
            name=name,
            email=f"{name.lower().replace(' ', '.')}@example.com",
            phone=f"+2547{random.randint(10000000, 99999999)}",
            company="Northwind Labs",
            interest=interests[index % len(interests)],
            budget=budgets[index % len(budgets)],
            source=sources[index % len(sources)],
            status=statuses[index % len(statuses)],
            lead_score=70 + index,
            priority="High" if index % 2 else "Medium",
            ai_confidence_score=round(0.70 + (index * 0.02), 2),
            notes="Captured through the demo pipeline.",
        )
        db.session.add(lead)

    db.session.commit()


def _create_default_user() -> None:
    if User.query.filter_by(email="demo@leadgen.app").first():
        return
    user = User(email="demo@leadgen.app", full_name="Demo Admin", business_name="Northwind Labs", role="admin")
    user.set_password("DemoPass123!")
    user.is_verified = True
    user.theme = "light"
    db.session.add(user)
    db.session.commit()


def _is_password_strong(password: str) -> bool:
    return len(password) >= 8 and re.search(r"[A-Z]", password) and re.search(r"[0-9]", password) and re.search(r"[^A-Za-z0-9]", password)


def _create_access_token(user: User, token_type: str = "access") -> str:
    now = datetime.now()
    expires_delta = timedelta(minutes=60 if token_type == "access" else 60 * 24 * 7)
    payload = {"sub": str(user.id), "type": token_type, "iat": int(now.timestamp()), "exp": int((now + expires_delta).timestamp())}
    return jwt.encode(payload, app.config["JWT_SECRET_KEY"], algorithm="HS256")


def _decode_token(token: str) -> dict[str, Any]:
    return jwt.decode(token, app.config["JWT_SECRET_KEY"], algorithms=["HS256"])


def _make_error(message: str, status_code: int = 400):
    return jsonify({"message": message, "success": False}), status_code


def _get_current_user() -> User | None:
    return getattr(g, "user", None)


def _auth_required(fn):
    @wraps(fn)
    def decorated(*args, **kwargs):
        token = request.headers.get("Authorization", "").replace("Bearer ", "", 1).strip()
        if not token:
            return _make_error("Authentication required", 401)
        try:
            payload = _decode_token(token)
        except jwt.ExpiredSignatureError:
            return _make_error("Token expired", 401)
        except jwt.InvalidTokenError:
            return _make_error("Invalid token", 401)

        user = User.query.get(payload.get("sub"))
        if not user or not user.is_active:
            return _make_error("User not found", 401)
        g.user = user
        return fn(*args, **kwargs)

    decorated.__name__ = fn.__name__
    return decorated


def _log_action(user: User | None, action: str, details: str | None = None) -> None:
    log_entry = AuditLog(user_id=user.id if user else None, action=action, details=details)
    db.session.add(log_entry)
    db.session.commit()


@app.before_request
def load_user_from_token() -> None:
    if request.path.startswith("/api/auth") or request.path == "/api/health":
        return
    token = request.headers.get("Authorization", "").replace("Bearer ", "", 1).strip()
    if not token:
        return
    try:
        payload = _decode_token(token)
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return
    user = User.query.get(payload.get("sub"))
    if user and user.is_active:
        g.user = user


@app.errorhandler(404)
def handle_not_found(_: Exception):
    return _make_error("Resource not found", 404)


@app.errorhandler(400)
def handle_bad_request(_: Exception):
    return _make_error("Bad request", 400)


@app.errorhandler(500)
def handle_server_error(_: Exception):
    return _make_error("Internal server error", 500)


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "service": "lead-platform-backend", "authenticated": bool(getattr(g, "user", None))})


@app.route("/api/auth/register", methods=["POST"])
def register_user():
    data = request.get_json() or {}
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")
    if not email or not password:
        return _make_error("Email and password are required", 400)
    if User.query.filter_by(email=email).first():
        return _make_error("User already exists", 409)
    if not _is_password_strong(password):
        return _make_error("Password must be at least 8 characters, contain an uppercase letter, a number, and a special character", 400)

    user = User(email=email, full_name=data.get("full_name", "Workspace User"), business_name=data.get("business_name", "AI Lead Workspace"))
    user.set_password(password)
    user.is_verified = True
    user.theme = data.get("theme", "light")
    db.session.add(user)
    db.session.commit()

    refresh_token = RefreshToken(token=os.urandom(24).hex(), user_id=user.id, expires_at=datetime.utcnow() + timedelta(days=7))
    db.session.add(refresh_token)
    db.session.commit()

    _log_action(user, "register", "Registered a new account")
    return jsonify({"message": "User created", "access_token": _create_access_token(user), "refresh_token": refresh_token.token, "user": user.to_dict()}), 201


@app.route("/api/auth/login", methods=["POST"])
def login_user():
    data = request.get_json() or {}
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")
    user = User.query.filter_by(email=email).first()

    if user and user.locked_until and user.locked_until > datetime.utcnow():
        return _make_error("Account temporarily locked", 403)

    if not user or not user.check_password(password):
        attempts = FAILED_LOGIN_ATTEMPTS.get(email, 0) + 1
        FAILED_LOGIN_ATTEMPTS[email] = attempts
        if attempts >= 5:
            user.locked_until = datetime.utcnow() + timedelta(minutes=15)
            db.session.commit()
        return _make_error("Invalid email or password", 401)

    FAILED_LOGIN_ATTEMPTS.pop(email, None)
    user.failed_login_attempts = 0
    user.last_login = datetime.utcnow()
    db.session.commit()

    refresh_token = RefreshToken(token=os.urandom(24).hex(), user_id=user.id, expires_at=datetime.utcnow() + timedelta(days=7))
    db.session.add(refresh_token)
    db.session.commit()

    _log_action(user, "login", "User logged in")
    return jsonify({"message": "Signed in", "access_token": _create_access_token(user), "refresh_token": refresh_token.token, "user": user.to_dict()})


@app.route("/api/auth/logout", methods=["POST"])
@_auth_required
def logout_user():
    user = _get_current_user()
    RefreshToken.query.filter_by(user_id=user.id).delete()
    db.session.commit()
    _log_action(user, "logout", "User logged out")
    return jsonify({"message": "Signed out"})


@app.route("/api/auth/refresh", methods=["POST"])
def refresh_token():
    data = request.get_json() or {}
    token_value = data.get("refresh_token") or request.headers.get("X-Refresh-Token")
    if not token_value:
        return _make_error("Refresh token required", 400)
    refresh_token_record = RefreshToken.query.filter_by(token=token_value).first()
    if not refresh_token_record or refresh_token_record.revoked or refresh_token_record.expires_at < datetime.utcnow():
        return _make_error("Refresh token invalid", 401)
    user = User.query.get(refresh_token_record.user_id)
    refresh_token_record.revoked = True
    db.session.add(RefreshToken(token=os.urandom(24).hex(), user_id=user.id, expires_at=datetime.utcnow() + timedelta(days=7)))
    db.session.commit()
    return jsonify({"message": "Token refreshed", "access_token": _create_access_token(user), "refresh_token": refresh_token_record.token})


@app.route("/api/auth/me", methods=["GET"])
@_auth_required
def get_current_user():
    return jsonify({"user": _get_current_user().to_dict()})


@app.route("/api/auth/preferences", methods=["PATCH"])
@_auth_required
def update_preferences():
    data = request.get_json() or {}
    user = _get_current_user()
    user.theme = data.get("theme", user.theme)
    user.preferences = data.get("preferences", user.preferences)
    db.session.commit()
    return jsonify({"user": user.to_dict()})


@app.route("/api/auth/forgot-password", methods=["POST"])
def forgot_password():
    data = request.get_json() or {}
    email = data.get("email", "").strip().lower()
    if email:
        user = User.query.filter_by(email=email).first()
        if user:
            _log_action(user, "forgot_password", "Password reset requested")
    return jsonify({"message": "If the email exists, a reset link has been sent"})


@app.route("/api/auth/reset-password", methods=["POST"])
def reset_password():
    data = request.get_json() or {}
    token = data.get("token")
    password = data.get("password", "")
    if not token or not password:
        return _make_error("Token and password are required", 400)
    if not _is_password_strong(password):
        return _make_error("Password must be at least 8 characters, contain an uppercase letter, a number, and a special character", 400)
    return jsonify({"message": "Password reset is ready for the next email integration"})


@app.route("/api/leads", methods=["GET"])
@_auth_required
def get_leads():
    business_id = request.args.get("business_id", "biz1")
    query = Lead.query.filter(Lead.business_id == business_id, Lead.deleted_at.is_(None)).order_by(Lead.created_at.desc())
    leads = query.all()
    return jsonify([lead.to_dict() for lead in leads])


@app.route("/api/leads", methods=["POST"])
@_auth_required
def create_lead():
    data = request.get_json() or {}
    lead = Lead(
        business_id=data.get("business_id", "default"),
        user_id=_get_current_user().id,
        name=data.get("name", "Unknown"),
        email=data.get("email"),
        phone=data.get("phone", ""),
        company=data.get("company"),
        website=data.get("website"),
        country=data.get("country"),
        city=data.get("city"),
        industry=data.get("industry"),
        interest=data.get("interest", ""),
        budget=data.get("budget"),
        source=data.get("source", "Web"),
        lead_source=data.get("lead_source", data.get("source", "Web")),
        status=data.get("status", "New"),
        priority=data.get("priority", "Medium"),
        notes=data.get("notes"),
        tags=",".join(data.get("tags", [])) if isinstance(data.get("tags"), list) else data.get("tags"),
    )
    db.session.add(lead)
    db.session.flush()

    interaction = Interaction(lead_id=lead.id, last_contacted=datetime.utcnow(), follow_up_needed=bool(data.get("follow_up_needed")))
    db.session.add(interaction)
    db.session.commit()

    _log_action(_get_current_user(), "create_lead", f"Created lead {lead.id}")
    return jsonify({"lead": lead.to_dict(), "autoReply": "Thanks for reaching out! We have saved your request."}), 201


@app.route("/api/leads/<int:lead_id>", methods=["GET"])
@_auth_required
def get_single_lead(lead_id: int):
    business_id = request.args.get("business_id", "biz1")
    lead = Lead.query.filter_by(id=lead_id, business_id=business_id).filter(Lead.deleted_at.is_(None)).first_or_404()
    return jsonify(lead.to_dict())


@app.route("/api/leads/<int:lead_id>", methods=["PUT"])
@_auth_required
def update_lead(lead_id: int):
    data = request.get_json() or {}
    lead = Lead.query.filter_by(id=lead_id, business_id=data.get("business_id", "biz1")).filter(Lead.deleted_at.is_(None)).first_or_404()
    for field in ["name", "email", "phone", "company", "website", "country", "city", "industry", "interest", "budget", "source", "lead_source", "status", "priority", "notes", "social_platform", "conversation_status", "ai_confidence_score", "lead_score"]:
        if field in data:
            setattr(lead, field, data[field])
    db.session.commit()
    return jsonify(lead.to_dict())


@app.route("/api/leads/<int:lead_id>", methods=["DELETE"])
@_auth_required
def delete_lead(lead_id: int):
    lead = Lead.query.filter_by(id=lead_id, business_id=request.args.get("business_id", "biz1")).filter(Lead.deleted_at.is_(None)).first_or_404()
    lead.deleted_at = datetime.utcnow()
    db.session.commit()
    return jsonify({"message": "Lead deleted"})


@app.route("/api/leads/<int:lead_id>/status", methods=["PATCH"])
@_auth_required
def update_lead_status(lead_id: int):
    data = request.get_json() or {}
    status = data.get("status")
    if status not in ["New", "Qualified", "Converted"]:
        return _make_error("Invalid status", 400)

    lead = Lead.query.filter_by(id=lead_id, business_id=data.get("business_id", "biz1")).filter(Lead.deleted_at.is_(None)).first_or_404()
    lead.status = status
    db.session.commit()
    return jsonify(lead.to_dict())


@app.route("/api/capture", methods=["POST"])
@_auth_required
def capture_lead():
    data = request.get_json() or {}
    lead = Lead(
        business_id=data.get("business_id", "default"),
        user_id=_get_current_user().id,
        name=data.get("name", "Unknown"),
        email=data.get("email"),
        phone=data.get("phone", ""),
        interest=data.get("interest", "General Inquiry"),
        budget=data.get("budget"),
        source=data.get("source", "Web"),
        lead_source=data.get("lead_source", data.get("source", "Web")),
        status=data.get("status", "New"),
    )
    db.session.add(lead)
    db.session.flush()
    interaction = Interaction(lead_id=lead.id, last_contacted=datetime.utcnow())
    db.session.add(interaction)
    db.session.commit()

    auto_replies = {"WhatsApp": "Thanks for your inquiry! Our team will respond shortly.", "Web": "Thanks for reaching out! We have saved your request."}
    return jsonify({"lead": lead.to_dict(), "autoReply": auto_replies.get(lead.source, auto_replies["Web"])}), 201


@app.route("/api/insights", methods=["GET"])
@_auth_required
def insights():
    business_id = request.args.get("business_id", "biz1")
    leads = Lead.query.filter(Lead.business_id == business_id, Lead.deleted_at.is_(None)).all()
    total = len(leads)
    status_counts = {"New": 0, "Qualified": 0, "Converted": 0}
    interests = {}
    for lead in leads:
        status_counts[lead.status] = status_counts.get(lead.status, 0) + 1
        if lead.interest:
            interests[lead.interest] = interests.get(lead.interest, 0) + 1
    top_interests = [name for name, _ in sorted(interests.items(), key=lambda item: item[1], reverse=True)[:5]]
    conversion_rate = round((status_counts.get("Converted", 0) / total) * 100, 1) if total else 0
    return jsonify({"totalLeads": total, "statusCounts": status_counts, "topInterests": top_interests, "conversionRate": conversion_rate, "leadsLastWeek": total})


@app.route("/api/dashboard/stats", methods=["GET"])
@_auth_required
def dashboard_stats():
    return insights()


@app.route("/api/activities", methods=["GET"])
@_auth_required
def activities():
    business_id = request.args.get("business_id", "biz1")
    leads = Lead.query.filter(Lead.business_id == business_id, Lead.deleted_at.is_(None)).order_by(Lead.created_at.desc()).limit(8).all()
    return jsonify([{"id": lead.id, "message": f"{lead.name} was captured from {lead.source or 'Web'}", "created_at": lead.created_at.isoformat()} for lead in leads])


@app.route("/api/followups", methods=["GET"])
@_auth_required
def followups():
    business_id = request.args.get("business_id", "biz1")
    cutoff = datetime.utcnow() - timedelta(hours=24)
    pending_leads = Lead.query.filter(Lead.business_id == business_id, Lead.status == "New", Lead.created_at < cutoff).all()
    return jsonify({"pendingFollowups": [lead.to_dict() for lead in pending_leads]})


@app.route("/api/leads/<int:lead_id>/messages", methods=["GET"])
@_auth_required
def get_messages(lead_id: int):
    business_id = request.args.get("business_id", "biz1")
    lead = Lead.query.filter_by(id=lead_id, business_id=business_id).first_or_404()
    messages = Message.query.filter_by(lead_id=lead_id).order_by(Message.timestamp.asc()).all()
    return jsonify([message.to_dict() for message in messages])


@app.route("/api/leads/<int:lead_id>/messages", methods=["POST"])
@_auth_required
def create_message(lead_id: int):
    business_id = request.args.get("business_id", "biz1")
    lead = Lead.query.filter_by(id=lead_id, business_id=business_id).first_or_404()
    data = request.get_json() or {}
    message = Message(lead_id=lead_id, message=data.get("message", ""), sender=data.get("sender", "business"))
    db.session.add(message)
    interaction = Interaction.query.filter_by(lead_id=lead_id).first()
    if interaction:
        interaction.last_contacted = datetime.utcnow()
    db.session.commit()
    return jsonify(message.to_dict()), 201


@app.route("/api/leads/<int:lead_id>/interaction", methods=["GET"])
@_auth_required
def get_interaction(lead_id: int):
    business_id = request.args.get("business_id", "biz1")
    lead = Lead.query.filter_by(id=lead_id, business_id=business_id).first_or_404()
    interaction = Interaction.query.filter_by(lead_id=lead_id).first_or_404()
    return jsonify(interaction.to_dict())


@app.route("/api/leads/<int:lead_id>/interaction", methods=["PATCH"])
@_auth_required
def update_interaction(lead_id: int):
    business_id = request.args.get("business_id", "biz1")
    lead = Lead.query.filter_by(id=lead_id, business_id=business_id).first_or_404()
    data = request.get_json() or {}
    interaction = Interaction.query.filter_by(lead_id=lead_id).first_or_404()
    if "follow_up_needed" in data:
        interaction.follow_up_needed = data.get("follow_up_needed")
    if "follow_up_sent" in data and data.get("follow_up_sent"):
        interaction.follow_up_sent = datetime.utcnow()
    db.session.commit()
    return jsonify(interaction.to_dict())


@app.route("/api/leads/<int:lead_id>/send-followup", methods=["POST"])
@_auth_required
def send_followup(lead_id: int):
    business_id = request.args.get("business_id", "biz1")
    lead = Lead.query.filter_by(id=lead_id, business_id=business_id).first_or_404()
    data = request.get_json() or {}
    message = Message(lead_id=lead_id, message=data.get("message", "Hi, just checking in! Is there anything else you need?"), sender="business")
    db.session.add(message)
    interaction = Interaction.query.filter_by(lead_id=lead_id).first()
    if interaction:
        interaction.follow_up_sent = datetime.utcnow()
        interaction.follow_up_needed = False
    db.session.commit()
    return jsonify({"status": "followup_sent", "message": message.to_dict(), "interaction": interaction.to_dict() if interaction else None}), 201


@app.route("/api/webhooks/<provider>", methods=["GET", "POST"])
def webhooks(provider: str):
    if request.method == "GET":
        return jsonify({"provider": provider, "status": "ready"})
    payload = request.get_json() or {}
    event = WebhookEvent(provider=provider, event_type=payload.get("event_type", "incoming"), payload=str(payload), status="queued")
    db.session.add(event)
    db.session.commit()
    return jsonify({"message": "Webhook queued", "event_id": event.id}), 201


@app.route("/api/whatsapp-webhook", methods=["GET", "POST"])
def whatsapp_webhook():
    if request.method == "GET":
        mode = request.args.get("hub.mode")
        token = request.args.get("hub.verify_token")
        challenge = request.args.get("hub.challenge")
        verify_token = os.getenv("WHATSAPP_VERIFY_TOKEN", "dev_verify_token_local")
        if mode == "subscribe" and token == verify_token:
            return challenge
        return "Forbidden", 403

    data = request.get_json() or {}
    lead = Lead(
        business_id=data.get("business_id", "default"),
        name=data.get("name", "WhatsApp User"),
        phone=data.get("from", ""),
        interest=data.get("body", "WhatsApp Inquiry"),
        source="WhatsApp",
        status="New",
    )
    db.session.add(lead)
    db.session.commit()
    return jsonify({"status": "lead captured", "lead": lead.to_dict()}), 201


@app.route("/api/integrations/providers", methods=["GET"])
def integration_providers():
    return jsonify({
        "providers": [
            {"name": "facebook", "status": "ready"},
            {"name": "instagram", "status": "ready"},
            {"name": "linkedin", "status": "ready"},
            {"name": "twitter", "status": "ready"},
            {"name": "tiktok", "status": "ready"},
            {"name": "whatsapp", "status": "ready"},
            {"name": "telegram", "status": "ready"},
            {"name": "email", "status": "ready"},
        ]
    })


with app.app_context():
    db.create_all()
    _create_default_user()
    _seed_demo_data()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
