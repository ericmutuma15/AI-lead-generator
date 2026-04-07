from flask import Flask, jsonify, request
from flask_cors import CORS
from models import db, Lead, Message, Interaction
from config import Config
from datetime import datetime, timedelta
import os
import random

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)
db.init_app(app)

application = app

# --- DEMO MOCK DATA ---
NAMES = [
    'Amina Hassan', 'John Mwangi', 'Sara Kimani', 'Peter Otieno', 'Grace Wanjiru',
    'David Njoroge', 'Lucy Muthoni', 'Brian Ochieng', 'Mary Atieno', 'Samuel Kiptoo',
    'Janet Wambui', 'Kevin Omondi', 'Cynthia Chebet', 'Pauline Naliaka', 'George Kariuki',
    'Diana Wafula', 'Victor Mutiso', 'Emily Cherono', 'Dennis Kiplangat', 'Faith Mumo',
    'James Mwangi', 'Mercy Wairimu', 'Patrick Otieno', 'Sharon Achieng', 'Josephine Njeri',
    'Stephen Kimutai', 'Caroline Wambua', 'Felix Kipkoech', 'Eunice Nyambura', 'Collins Barasa',
    'Beatrice Chebet', 'Alex Njuguna', 'Irene Wanjiku', 'Moses Kipruto', 'Agnes Atieno',
    'Nicholas Kiptoo', 'Rosemary Wanjiru', 'Allan Oduor', 'Millicent Akinyi', 'Edwin Mutua',
    'Purity Wambui', 'Oscar Kiprono', 'Lilian Chebet', 'Fredrick Otieno', 'Hannah Naliaka',
    'Elijah Kipchumba', 'Gloria Wairimu', 'Martin Kimani', 'Phoebe Chepkemoi', 'Patrick Kiprono'
]
INTERESTS = [
    'Order Tracking', 'Product Inquiry', 'Service Booking', 'Support', 'Demo Request',
    'Bulk Order', 'Custom Quote', 'Partnership', 'Complaint', 'Feedback'
]
BUDGETS = [
    'KES 2,000 - 5,000', 'KES 5,000 - 10,000', 'KES 10,000+', 'KES 1,000 - 2,000', 'KES 500 - 1,000'
]
SOURCES = ['Web', 'WhatsApp', 'Referral', 'Facebook', 'Instagram']
STATUSES = ['New', 'Qualified', 'Converted']

MOCK_LEADS = []
base_date = datetime(2026, 4, 1, 10, 0, 0)
for i in range(50):
    MOCK_LEADS.append({
        'id': i + 1,
        'business_id': 'biz1' if i % 2 == 0 else 'biz2',
        'name': NAMES[i % len(NAMES)],
        'phone': f'+2547{random.randint(10000000,99999999)}',
        'interest': INTERESTS[i % len(INTERESTS)],
        'budget': BUDGETS[i % len(BUDGETS)],
        'source': SOURCES[i % len(SOURCES)],
        'status': STATUSES[i % len(STATUSES)],
        'created_at': (base_date + timedelta(days=i)).strftime('%Y-%m-%dT%H:%M:%S'),
    })

def get_demo_leads(business_id):
    return [lead for lead in MOCK_LEADS if lead['business_id'] == business_id]

@app.route('/api/leads', methods=['GET'])
def get_leads():
    business_id = request.args.get('business_id', 'biz1')
    leads = get_demo_leads(business_id)
    # Sort by created_at desc
    leads = sorted(leads, key=lambda l: l['created_at'], reverse=True)
    return jsonify(leads)

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
    business_id = request.args.get('business_id', 'biz1')
    leads = get_demo_leads(business_id)
    total = len(leads)
    status_counts = {
        'New': len([l for l in leads if l['status'] == 'New']),
        'Qualified': len([l for l in leads if l['status'] == 'Qualified']),
        'Converted': len([l for l in leads if l['status'] == 'Converted']),
    }
    interests = {}
    for lead in leads:
        interests[lead['interest']] = interests.get(lead['interest'], 0) + 1
    top_interests = sorted(interests.items(), key=lambda x: x[1], reverse=True)[:5]
    conversion_rate = 0
    if total > 0:
        conversion_rate = round((status_counts.get('Converted', 0) / total) * 100, 1)
    # Lead trends (last 7 days)
    # For demo, just count all
    return jsonify({
        'totalLeads': total,
        'statusCounts': status_counts,
        'topInterests': [i[0] for i in top_interests],
        'conversionRate': conversion_rate,
        'leadsLastWeek': total,
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

application = app

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
