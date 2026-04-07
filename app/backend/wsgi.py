from flask import Flask, jsonify, request
from flask_cors import CORS
from models import db, Lead, Message, Interaction
from config import Config
from datetime import datetime, timedelta
import os

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)
db.init_app(app)

def seed_mock_data():
    sample_leads = [
        {
            'business_id': 'biz1',
            'name': 'Amina Hassan',
            'phone': '+254712345678',
            'interest': 'Order Tracking',
            'budget': 'KES 2,000 - 5,000',
            'source': 'Web',
            'status': 'New',
        },
        {
            'business_id': 'biz1',
            'name': 'John Mwangi',
            'phone': '+254700112233',
            'interest': 'Product Inquiry',
            'budget': 'KES 5,000 - 10,000',
            'source': 'WhatsApp',
            'status': 'Qualified',
        },
        {
            'business_id': 'biz2',
            'name': 'Sara Kimani',
            'phone': '+254733445566',
            'interest': 'Service Booking',
            'budget': 'KES 10,000+',
            'source': 'Web',
            'status': 'Converted',
        },
    ]
    if Lead.query.first() is None:
        for lead_data in sample_leads:
            lead = Lead(**lead_data)
            db.session.add(lead)
            db.session.flush()
            
            # Create interaction record
            interaction = Interaction(lead_id=lead.id, last_contacted=datetime.utcnow())
            db.session.add(interaction)
            
            # Add sample messages
            messages = [
                Message(lead_id=lead.id, message='Hi, I am interested in your service', sender='customer'),
                Message(lead_id=lead.id, message='Thanks for reaching out! I\'d be happy to help.', sender='business'),
            ]
            db.session.add_all(messages)
        
        db.session.commit()

with app.app_context():
    db.create_all()
    seed_mock_data()

@app.route('/api/leads', methods=['GET'])
def get_leads():
    business_id = request.args.get('business_id', 'default')
    leads = Lead.query.filter_by(business_id=business_id).order_by(Lead.created_at.desc()).all()
    return jsonify([lead.to_dict() for lead in leads])

@app.route('/api/leads', methods=['POST'])
def create_lead():
    data = request.get_json() or {}
    lead = Lead(
        business_id=data.get('business_id', 'default'),
        name=data.get('name', 'Unknown'),
        phone=data.get('phone', ''),
        interest=data.get('interest', ''),
        source=data.get('source', 'Web'),
        status=data.get('status', 'New'),
    )
    db.session.add(lead)
    db.session.commit()
    return jsonify(lead.to_dict()), 201

@app.route('/api/insights', methods=['GET'])
def insights():
    business_id = request.args.get('business_id', 'default')
    leads = Lead.query.filter_by(business_id=business_id).all()
    total = len(leads)
    status_counts = {
        'New': Lead.query.filter_by(business_id=business_id, status='New').count(),
        'Qualified': Lead.query.filter_by(business_id=business_id, status='Qualified').count(),
        'Converted': Lead.query.filter_by(business_id=business_id, status='Converted').count(),
    }
    interests = {}
    for lead in leads:
        interests[lead.interest] = interests.get(lead.interest, 0) + 1
    top_interests = sorted(interests.items(), key=lambda x: x[1], reverse=True)[:5]
    
    conversion_rate = 0
    if total > 0:
        conversion_rate = round((status_counts.get('Converted', 0) / total) * 100, 1)
    
    # Lead trends (last 7 days)
    week_ago = datetime.utcnow() - timedelta(days=7)
    leads_last_week = Lead.query.filter(
        Lead.business_id == business_id,
        Lead.created_at >= week_ago
    ).all()
    
    return jsonify({
        'totalLeads': total,
        'statusCounts': status_counts,
        'topInterests': [i[0] for i in top_interests],
        'conversionRate': conversion_rate,
        'leadsLastWeek': len(leads_last_week),
    })

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'service': 'lead-platform-backend'})

@app.route('/api/capture', methods=['POST'])
def capture_lead():
    try:
        data = request.get_json() or {}
        lead = Lead(
            business_id=data.get('business_id', 'default'),
            name=data.get('name', 'Unknown'),
            phone=data.get('phone', ''),
            interest=data.get('interest', 'General Inquiry'),
            budget=data.get('budget', None),
            source=data.get('source', 'Web'),
            status=data.get('status', 'New'),
        )
        db.session.add(lead)
        db.session.flush()

        interaction = Interaction(lead_id=lead.id, last_contacted=datetime.utcnow())
        db.session.add(interaction)
        db.session.commit()

        auto_replies = {
            'WhatsApp': 'Thanks for your inquiry! Our team will respond shortly.',
            'Web': 'Thanks for reaching out! We have saved your request.',
        }
        return jsonify({
            'lead': lead.to_dict(),
            'autoReply': auto_replies.get(lead.source, auto_replies['Web']),
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
    }), 201

@app.route('/api/leads/<int:lead_id>/status', methods=['PATCH'])
def update_lead_status(lead_id):
    data = request.get_json() or {}
    status = data.get('status')
    business_id = data.get('business_id', 'default')
    if status not in ['New', 'Qualified', 'Converted']:
        return jsonify({'error': 'Invalid status'}), 400

    lead = Lead.query.filter_by(id=lead_id, business_id=business_id).first_or_404()
    lead.status = status
    db.session.commit()
    return jsonify(lead.to_dict())

@app.route('/api/followups', methods=['GET'])
def followups():
    business_id = request.args.get('business_id', 'default')
    cutoff = datetime.utcnow() - timedelta(hours=24)
    pending_leads = Lead.query.filter(Lead.business_id == business_id, Lead.status == 'New', Lead.created_at < cutoff).all()
    return jsonify({'pendingFollowups': [lead.to_dict() for lead in pending_leads]})

@app.route('/api/leads/<int:lead_id>/messages', methods=['GET'])
def get_messages(lead_id):
    business_id = request.args.get('business_id', 'default')
    lead = Lead.query.filter_by(id=lead_id, business_id=business_id).first_or_404()
    messages = Message.query.filter_by(lead_id=lead_id).order_by(Message.timestamp.asc()).all()
    return jsonify([msg.to_dict() for msg in messages])

@app.route('/api/leads/<int:lead_id>/messages', methods=['POST'])
def create_message(lead_id):
    business_id = request.args.get('business_id', 'default')
    lead = Lead.query.filter_by(id=lead_id, business_id=business_id).first_or_404()
    data = request.get_json() or {}
    
    message = Message(
        lead_id=lead_id,
        message=data.get('message', ''),
        sender=data.get('sender', 'business'),
    )
    db.session.add(message)
    
    interaction = Interaction.query.filter_by(lead_id=lead_id).first()
    if interaction:
        interaction.last_contacted = datetime.utcnow()
    
    db.session.commit()
    return jsonify(message.to_dict()), 201

@app.route('/api/leads/<int:lead_id>/interaction', methods=['GET'])
def get_interaction(lead_id):
    business_id = request.args.get('business_id', 'default')
    lead = Lead.query.filter_by(id=lead_id, business_id=business_id).first_or_404()
    interaction = Interaction.query.filter_by(lead_id=lead_id).first_or_404()
    return jsonify(interaction.to_dict())

application = app

@app.route('/api/leads/<int:lead_id>/interaction', methods=['PATCH'])
def update_interaction(lead_id):
    business_id = request.args.get('business_id', 'default')
    lead = Lead.query.filter_by(id=lead_id, business_id=business_id).first_or_404()
    data = request.get_json() or {}
    
    interaction = Interaction.query.filter_by(lead_id=lead_id).first_or_404()
    if 'follow_up_needed' in data:
        interaction.follow_up_needed = data.get('follow_up_needed')
    if 'follow_up_sent' in data and data.get('follow_up_sent'):
        interaction.follow_up_sent = datetime.utcnow()
    
    db.session.commit()
    return jsonify(interaction.to_dict())

@app.route('/api/leads/<int:lead_id>/send-followup', methods=['POST'])
def send_followup(lead_id):
    business_id = request.args.get('business_id', 'default')
    lead = Lead.query.filter_by(id=lead_id, business_id=business_id).first_or_404()
    data = request.get_json() or {}
    
    message = Message(
        lead_id=lead_id,
        message=data.get('message', 'Hi, just checking in! Is there anything else you need?'),
        sender='business',
    )
    db.session.add(message)
    
    interaction = Interaction.query.filter_by(lead_id=lead_id).first()
    if interaction:
        interaction.follow_up_sent = datetime.utcnow()
        interaction.follow_up_needed = False
    
    db.session.commit()
    
    return jsonify({
        'status': 'followup_sent',
        'message': message.to_dict(),
        'interaction': interaction.to_dict() if interaction else None,
    }), 201

@app.route('/api/whatsapp-webhook', methods=['GET', 'POST'])
def whatsapp_webhook():
    if request.method == 'GET':
        # WhatsApp verification
        mode = request.args.get('hub.mode')
        token = request.args.get('hub.verify_token')
        challenge = request.args.get('hub.challenge')
        verify_token = os.getenv('WHATSAPP_VERIFY_TOKEN', 'dev_verify_token_local')
        if mode == 'subscribe' and token == verify_token:
            return challenge
        return 'Forbidden', 403

    data = request.get_json() or {}
    # Assume data structure from WhatsApp
    # For simplicity, assume data has 'business_id', 'from', 'body', etc.
    lead = Lead(
        business_id=data.get('business_id', 'default'),
        name=data.get('name', 'WhatsApp User'),
        phone=data.get('from', ''),
        interest=data.get('body', 'WhatsApp Inquiry'),
        source='WhatsApp',
        status='New',
    )
    db.session.add(lead)
    db.session.commit()
    return jsonify({'status': 'lead captured', 'lead': lead.to_dict()}), 201

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
