from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Lead(db.Model):
    __tablename__ = 'leads'

    id = db.Column(db.Integer, primary_key=True)
    business_id = db.Column(db.String(64), nullable=False, default='default')
    name = db.Column(db.String(128), nullable=False)
    phone = db.Column(db.String(64), nullable=False)
    interest = db.Column(db.String(256), nullable=False)
    budget = db.Column(db.String(64), nullable=True)
    source = db.Column(db.String(64), nullable=False)
    status = db.Column(db.String(32), nullable=False, default='New')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    messages = db.relationship('Message', backref='lead', cascade='all, delete-orphan')
    interaction = db.relationship('Interaction', backref='lead', uselist=False, cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'business_id': self.business_id,
            'name': self.name,
            'phone': self.phone,
            'interest': self.interest,
            'budget': self.budget,
            'source': self.source,
            'status': self.status,
            'created_at': self.created_at.isoformat(),
        }


class Message(db.Model):
    __tablename__ = 'messages'

    id = db.Column(db.Integer, primary_key=True)
    lead_id = db.Column(db.Integer, db.ForeignKey('leads.id'), nullable=False)
    message = db.Column(db.Text, nullable=False)
    sender = db.Column(db.String(32), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'lead_id': self.lead_id,
            'message': self.message,
            'sender': self.sender,
            'timestamp': self.timestamp.isoformat(),
        }


class Interaction(db.Model):
    __tablename__ = 'interactions'

    id = db.Column(db.Integer, primary_key=True)
    lead_id = db.Column(db.Integer, db.ForeignKey('leads.id'), nullable=False)
    last_contacted = db.Column(db.DateTime, nullable=True)
    follow_up_needed = db.Column(db.Boolean, default=False)
    follow_up_sent = db.Column(db.DateTime, nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'lead_id': self.lead_id,
            'last_contacted': self.last_contacted.isoformat() if self.last_contacted else None,
            'follow_up_needed': self.follow_up_needed,
            'follow_up_sent': self.follow_up_sent.isoformat() if self.follow_up_sent else None,
        }

