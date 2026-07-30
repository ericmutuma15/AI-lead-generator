#!/usr/bin/env python3
import random
from datetime import datetime

from wsgi import app
from models import AuditLog, Interaction, Lead, RefreshToken, User, db

SAMPLE_LEADS = [
    {
        "name": "Amina Hassan",
        "email": "amina.hassan@example.com",
        "phone": "+254712345678",
        "company": "Northwind Labs",
        "interest": "Product Inquiry",
        "budget": "KES 5,000 - 10,000",
        "source": "Web",
        "status": "New",
        "priority": "Medium",
        "notes": "Interested in learning more about our AI lead tools.",
    },
    {
        "name": "John Mwangi",
        "email": "john.mwangi@example.com",
        "phone": "+254711234567",
        "company": "Riverbend Co.",
        "interest": "Support",
        "budget": "KES 2,000 - 5,000",
        "source": "WhatsApp",
        "status": "Qualified",
        "priority": "High",
        "notes": "Requested a follow-up call to discuss custom pricing.",
    },
    {
        "name": "Sarah Kimani",
        "email": "sarah.kimani@example.com",
        "phone": "+254700123456",
        "company": "Safari Solutions",
        "interest": "Order Tracking",
        "budget": "KES 10,000+",
        "source": "Referral",
        "status": "Converted",
        "priority": "High",
        "notes": "Converted after onboarding call.",
    },
    {
        "name": "Peter Otieno",
        "email": "peter.otieno@example.com",
        "phone": "+254701234567",
        "company": "M-Kopa",
        "interest": "Custom Quote",
        "budget": "KES 5,000 - 10,000",
        "source": "Facebook",
        "status": "New",
        "priority": "Medium",
        "notes": "Needs pricing details for enterprise volume.",
    },
    {
        "name": "Grace Wanjiru",
        "email": "grace.wanjiru@example.com",
        "phone": "+254707123456",
        "company": "Jambo Retail",
        "interest": "Product Inquiry",
        "budget": "KES 10,000+",
        "source": "Instagram",
        "status": "Qualified",
        "priority": "High",
        "notes": "Interested in bulk pricing and product specs.",
    },
    {
        "name": "David Njoroge",
        "email": "david.njoroge@example.com",
        "phone": "+254708123456",
        "company": "Kilimani Logistics",
        "interest": "Support",
        "budget": "KES 5,000 - 10,000",
        "source": "Web",
        "status": "New",
        "priority": "Medium",
        "notes": "Looking for onboarding support for new clients.",
    },
    {
        "name": "Lucy Muthoni",
        "email": "lucy.muthoni@example.com",
        "phone": "+254709123456",
        "company": "Mountview Health",
        "interest": "Custom Quote",
        "budget": "KES 10,000+",
        "source": "Email",
        "status": "Qualified",
        "priority": "High",
        "notes": "Requesting a quotation for a new campaign.",
    },
    {
        "name": "Brian Ochieng",
        "email": "brian.ochieng@example.com",
        "phone": "+254710123456",
        "company": "Horizon Tech",
        "interest": "Partnership",
        "budget": "KES 5,000 - 10,000",
        "source": "Referral",
        "status": "Converted",
        "priority": "High",
        "notes": "Already agreed to partnership terms.",
    },
    {
        "name": "Mary Atieno",
        "email": "mary.atieno@example.com",
        "phone": "+254711987654",
        "company": "Nairobi Co-Works",
        "interest": "Order Tracking",
        "budget": "KES 2,000 - 5,000",
        "source": "WhatsApp",
        "status": "New",
        "priority": "Low",
        "notes": "Tracking an existing order shipment.",
    },
    {
        "name": "Samuel Kiptoo",
        "email": "samuel.kiptoo@example.com",
        "phone": "+254712987654",
        "company": "Savannah Foods",
        "interest": "Support",
        "budget": "KES 5,000 - 10,000",
        "source": "Web",
        "status": "Qualified",
        "priority": "High",
        "notes": "Needs help setting up recurring orders.",
    },
]


def ensure_demo_user():
    user = User.query.filter_by(email="demo@leadgen.app").first()
    if user:
        return user

    user = User(
        email="demo@leadgen.app",
        full_name="Demo Admin",
        business_name="Northwind Labs",
        role="admin",
        is_verified=True,
        theme="light",
    )
    user.set_password("DemoPass123!")
    db.session.add(user)
    db.session.commit()
    return user


def seed_leads(user):
    existing_leads = Lead.query.filter_by(business_id="biz1").count()
    if existing_leads >= len(SAMPLE_LEADS):
        print(f"Database already has {existing_leads} leads; skipping lead seeding.")
        return

    for lead_data in SAMPLE_LEADS:
        if Lead.query.filter_by(email=lead_data["email"]).first():
            continue

        lead = Lead(
            business_id="biz1",
            user_id=user.id,
            name=lead_data["name"],
            email=lead_data["email"],
            phone=lead_data["phone"],
            company=lead_data["company"],
            interest=lead_data["interest"],
            budget=lead_data["budget"],
            source=lead_data["source"],
            status=lead_data["status"],
            priority=lead_data["priority"],
            notes=lead_data["notes"],
            ai_confidence_score=round(random.uniform(0.65, 0.95), 2),
            lead_score=random.randint(60, 95),
        )
        db.session.add(lead)
        db.session.flush()

        interaction = Interaction(
            lead_id=lead.id,
            last_contacted=datetime.utcnow(),
            follow_up_needed=lead.status == "New",
        )
        db.session.add(interaction)

    db.session.commit()
    print(f"Seeded {len(SAMPLE_LEADS)} demo leads.")


def main():
    with app.app_context():
        db.create_all()
        user = ensure_demo_user()
        seed_leads(user)
        print("Database seeding complete.")


if __name__ == "__main__":
    main()
