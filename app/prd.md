Product Requirements Document (PRD)

Product Name

AI Lead Capture & Insights Platform


---

1. Overview

This product is a lightweight AI-powered platform designed to help small and medium businesses capture, qualify, and convert customer leads while generating actionable insights.

The system combines:

Lead capture (WhatsApp + Website chatbot)

Basic automation (auto-replies, follow-ups)

Structured data storage (CRM-lite)

Business insights (dashboard + analytics)


The goal is to move businesses from:

Reactive communication → Proactive engagement

Scattered chats → Structured data

No insights → Actionable decisions



---

2. Problem Statement

Many businesses:

Lose leads due to slow or inconsistent responses

Rely heavily on WhatsApp without structured tracking

Have no visibility into customer behavior or demand trends

Do not follow up effectively with potential customers


This results in lost revenue and poor customer experience.


---

3. Objectives

Primary Objectives

Capture all incoming customer inquiries automatically

Structure and store lead data

Provide real-time visibility into leads and interactions

Enable basic automation for follow-ups


Secondary Objectives

Generate insights from collected data

Improve lead conversion rates

Prepare system for advanced AI automation



---

4. Target Users

Primary Users

Small online businesses (Instagram/WhatsApp sellers)

Retail shops


Secondary Users (Future Expansion)

Clinics

Real estate agents

Logistics companies

Agribusinesses



---

5. Key Features (MVP)

5.1 Lead Capture

WhatsApp Bot

Auto-replies to incoming messages

Collects:

Name

Phone number

Interest (product/service)

Budget (optional)



Website Chatbot

Embedded chat widget

Same flow as WhatsApp bot



---

5.2 Lead Management (CRM-lite)

Store leads in database

Lead attributes:

Name

Contact

Interest

Source (WhatsApp/Web)

Status (New, Qualified, Converted)

Timestamp




---

5.3 Automation

Auto Responses

Instant reply to every inquiry


Follow-Ups

Trigger follow-up message after inactivity (e.g., 24 hours)


Notifications

Notify business on new high-intent leads



---

5.4 Dashboard

Lead Overview

Total leads

New vs Qualified vs Converted


Lead Table

List of all leads

Status tracking


Basic Analytics

Most requested products/services

Lead trends over time

Conversion rate



---

5.5 Insights Engine (Basic)

Generate simple summaries:

"Most customers are interested in Product X"

"Peak inquiries occur in the evening"




---

6. User Flow

Customer Flow

1. Customer sends message (WhatsApp/Web)


2. Bot responds instantly


3. Bot asks structured questions


4. Customer provides responses


5. Data is stored as a lead



Business Flow

1. Business logs into dashboard


2. Views leads and statuses


3. Receives notifications for new leads


4. Follows up or lets automation handle it




---

7. Technical Architecture

Frontend

React (Vite)

Dashboard UI


Backend

Flask API


Database

PostgreSQL


Integrations

WhatsApp API (Twilio or Meta)



---

8. Database Schema (MVP)

leads

id

name

phone

interest

source

status

created_at


messages

id

lead_id

message

sender

timestamp


interactions

lead_id

last_contacted

follow_up_needed



---

9. Success Metrics

Number of leads captured

Response time to customers

Lead conversion rate

Number of automated interactions

Customer retention (repeat interactions)



---

10. Monetization Strategy

Pricing Model

Setup Fee: KES 3,000 – 10,000

Monthly Subscription: KES 1,500 – 5,000


Future Models

Per-lead pricing

Performance-based pricing



---

11. Roadmap (Post-MVP)

Phase 2

AI-based lead qualification

Smart conversation summaries


Phase 3

Advanced analytics & predictions

Customer segmentation


Phase 4

GIS dashboard (location-based insights)


Phase 5

Full automation (sales & booking flows)



---

12. Risks & Mitigation

Risk: Overengineering AI

Mitigation: Start with rule-based flows


Risk: Low adoption

Mitigation: Focus on simple onboarding and clear value


Risk: Integration complexity

Mitigation: Start with one channel (WhatsApp)



---

13. MVP Scope Summary

The MVP will include:

WhatsApp bot (lead capture)

Simple website chatbot

Lead database

Basic dashboard

Simple automation (auto-replies + follow-ups)


This version is designed to be built quickly, tested with real users, and iterated based on feedback.


---

14. Future Vision

A unified platform where:

AI agents handle customer interactions end-to-end

Businesses receive real-time insights

Data drives automated decisions

Revenue generation is directly improved through automation



---

End of Document