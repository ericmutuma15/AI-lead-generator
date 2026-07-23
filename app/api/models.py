from datetime import datetime
from uuid import uuid4

from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    public_id = db.Column(db.String(36), unique=True, nullable=False, default=lambda: str(uuid4()))
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    full_name = db.Column(db.String(200), default="Team Member")
    business_name = db.Column(db.String(200), default="AI Lead Workspace")
    role = db.Column(db.String(32), default="user")
    permissions = db.Column(db.Text, default="[]")
    avatar = db.Column(db.String(255), nullable=True)
    subscription_plan = db.Column(db.String(64), default="starter")
    timezone = db.Column(db.String(64), default="UTC")
    preferences = db.Column(db.Text, default='{"theme":"light"}')
    theme = db.Column(db.String(16), default="light")
    api_key = db.Column(db.String(255), nullable=True)
    is_active = db.Column(db.Boolean, default=True)
    is_verified = db.Column(db.Boolean, default=False)
    last_login = db.Column(db.DateTime, nullable=True)
    failed_login_attempts = db.Column(db.Integer, default=0)
    locked_until = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    deleted_at = db.Column(db.DateTime, nullable=True)

    leads = db.relationship("Lead", foreign_keys="Lead.user_id", back_populates="user", cascade="all, delete-orphan")
    assigned_leads = db.relationship("Lead", foreign_keys="Lead.assigned_user_id", back_populates="assigned_user")
    refresh_tokens = db.relationship("RefreshToken", back_populates="user", cascade="all, delete-orphan")
    social_accounts = db.relationship("SocialAccount", back_populates="user", cascade="all, delete-orphan")
    notifications = db.relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    audit_logs = db.relationship("AuditLog", back_populates="user", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "public_id": self.public_id,
            "email": self.email,
            "full_name": self.full_name,
            "business_name": self.business_name,
            "role": self.role,
            "subscription_plan": self.subscription_plan,
            "timezone": self.timezone,
            "theme": self.theme,
            "preferences": self.preferences,
            "is_verified": self.is_verified,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }

    def set_password(self, password):
        from werkzeug.security import generate_password_hash

        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        from werkzeug.security import check_password_hash

        return check_password_hash(self.password_hash, password)


class Lead(db.Model):
    __tablename__ = "leads"

    id = db.Column(db.Integer, primary_key=True)
    public_id = db.Column(db.String(36), unique=True, nullable=False, default=lambda: str(uuid4()))
    business_id = db.Column(db.String(64), nullable=False, default="default", index=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True, index=True)
    name = db.Column(db.String(128), nullable=False, index=True)
    email = db.Column(db.String(255), nullable=True, index=True)
    phone = db.Column(db.String(64), nullable=True, index=True)
    company = db.Column(db.String(200), nullable=True)
    website = db.Column(db.String(255), nullable=True)
    country = db.Column(db.String(100), nullable=True)
    city = db.Column(db.String(100), nullable=True)
    industry = db.Column(db.String(100), nullable=True)
    lead_source = db.Column(db.String(64), nullable=True, default="Web")
    social_platform = db.Column(db.String(64), nullable=True)
    lead_score = db.Column(db.Integer, default=0)
    status = db.Column(db.String(32), nullable=False, default="New", index=True)
    priority = db.Column(db.String(16), default="Medium")
    assigned_user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True, index=True)
    conversation_status = db.Column(db.String(64), default="New")
    ai_confidence_score = db.Column(db.Float, default=0.0)
    last_contact = db.Column(db.DateTime, nullable=True)
    next_follow_up = db.Column(db.DateTime, nullable=True)
    notes = db.Column(db.Text, nullable=True)
    tags = db.Column(db.Text, nullable=True)
    interest = db.Column(db.String(256), nullable=True)
    budget = db.Column(db.String(64), nullable=True)
    source = db.Column(db.String(64), nullable=True, default="Web")
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    deleted_at = db.Column(db.DateTime, nullable=True)

    user = db.relationship("User", foreign_keys=[user_id], back_populates="leads")
    assigned_user = db.relationship("User", foreign_keys=[assigned_user_id], back_populates="assigned_leads")
    messages = db.relationship("Message", back_populates="lead", cascade="all, delete-orphan")
    interaction = db.relationship("Interaction", back_populates="lead", uselist=False, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "public_id": self.public_id,
            "business_id": self.business_id,
            "user_id": self.user_id,
            "name": self.name,
            "email": self.email,
            "phone": self.phone,
            "company": self.company,
            "website": self.website,
            "country": self.country,
            "city": self.city,
            "industry": self.industry,
            "lead_source": self.lead_source or self.source,
            "social_platform": self.social_platform,
            "lead_score": self.lead_score,
            "status": self.status,
            "priority": self.priority,
            "conversation_status": self.conversation_status,
            "ai_confidence_score": self.ai_confidence_score,
            "last_contact": self.last_contact.isoformat() if self.last_contact else None,
            "next_follow_up": self.next_follow_up.isoformat() if self.next_follow_up else None,
            "notes": self.notes,
            "tags": self.tags,
            "interest": self.interest,
            "budget": self.budget,
            "source": self.source or self.lead_source,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }


class Message(db.Model):
    __tablename__ = "messages"

    id = db.Column(db.Integer, primary_key=True)
    lead_id = db.Column(db.Integer, db.ForeignKey("leads.id"), nullable=False, index=True)
    message = db.Column(db.Text, nullable=False)
    sender = db.Column(db.String(32), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    lead = db.relationship("Lead", back_populates="messages")

    def to_dict(self):
        return {
            "id": self.id,
            "lead_id": self.lead_id,
            "message": self.message,
            "sender": self.sender,
            "timestamp": self.timestamp.isoformat() if self.timestamp else None,
        }


class Interaction(db.Model):
    __tablename__ = "interactions"

    id = db.Column(db.Integer, primary_key=True)
    lead_id = db.Column(db.Integer, db.ForeignKey("leads.id"), nullable=False, unique=True, index=True)
    last_contacted = db.Column(db.DateTime, nullable=True)
    follow_up_needed = db.Column(db.Boolean, default=False)
    follow_up_sent = db.Column(db.DateTime, nullable=True)

    lead = db.relationship("Lead", back_populates="interaction")

    def to_dict(self):
        return {
            "id": self.id,
            "lead_id": self.lead_id,
            "last_contacted": self.last_contacted.isoformat() if self.last_contacted else None,
            "follow_up_needed": self.follow_up_needed,
            "follow_up_sent": self.follow_up_sent.isoformat() if self.follow_up_sent else None,
        }


class RefreshToken(db.Model):
    __tablename__ = "refresh_tokens"

    id = db.Column(db.Integer, primary_key=True)
    token = db.Column(db.String(255), unique=True, nullable=False, index=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, index=True)
    expires_at = db.Column(db.DateTime, nullable=False)
    revoked = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship("User", back_populates="refresh_tokens")


class SocialAccount(db.Model):
    __tablename__ = "social_accounts"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, index=True)
    platform = db.Column(db.String(64), nullable=False)
    account_id = db.Column(db.String(128), nullable=True)
    business_id = db.Column(db.String(128), nullable=True)
    permissions = db.Column(db.Text, default="[]")
    webhook_id = db.Column(db.String(128), nullable=True)
    access_token = db.Column(db.Text, nullable=True)
    refresh_token = db.Column(db.Text, nullable=True)
    expires_at = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = db.relationship("User", back_populates="social_accounts")


class WebhookEvent(db.Model):
    __tablename__ = "webhook_events"

    id = db.Column(db.Integer, primary_key=True)
    provider = db.Column(db.String(64), nullable=False, index=True)
    event_type = db.Column(db.String(128), nullable=False)
    payload = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(32), default="queued")
    retries = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class Notification(db.Model):
    __tablename__ = "notifications"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, index=True)
    title = db.Column(db.String(200), nullable=False)
    body = db.Column(db.Text, nullable=False)
    channel = db.Column(db.String(32), default="in_app")
    is_read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship("User", back_populates="notifications")


class AuditLog(db.Model):
    __tablename__ = "audit_logs"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True, index=True)
    action = db.Column(db.String(200), nullable=False)
    details = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship("User", back_populates="audit_logs")

