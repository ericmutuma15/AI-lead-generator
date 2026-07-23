import sys
from pathlib import Path
from uuid import uuid4

sys.path.append(str(Path(__file__).resolve().parents[1]))

from main import app


def test_health_endpoint():
    client = app.test_client()
    response = client.get('/api/health')
    assert response.status_code == 200
    assert response.get_json()['status'] == 'ok'


def test_auth_register_and_login_flow():
    client = app.test_client()
    email = f'test-{uuid4().hex[:8]}@example.com'
    payload = {
        'email': email,
        'password': 'StrongPass123!'
    }
    register_response = client.post('/api/auth/register', json=payload)
    assert register_response.status_code == 201

    login_response = client.post('/api/auth/login', json=payload)
    assert login_response.status_code == 200
    data = login_response.get_json()
    assert data['access_token']
    assert data['refresh_token']


def test_lead_crud_flow():
    client = app.test_client()
    email = f'crud-{uuid4().hex[:8]}@example.com'
    auth_payload = {
        'email': email,
        'password': 'StrongPass123!'
    }
    client.post('/api/auth/register', json=auth_payload)
    login_response = client.post('/api/auth/login', json=auth_payload)
    token = login_response.get_json()['access_token']
    headers = {'Authorization': f'Bearer {token}'}

    payload = {
        'name': 'Ada Lovelace',
        'phone': '+254700000000',
        'email': 'ada@example.com',
        'interest': 'AI Automation',
        'budget': 'KES 100000',
        'source': 'Web',
        'business_id': 'biz1'
    }
    create_response = client.post('/api/capture', json=payload, headers=headers)
    assert create_response.status_code == 201

    created = create_response.get_json()['lead']
    lead_id = created['id']

    list_response = client.get('/api/leads?business_id=biz1', headers=headers)
    assert list_response.status_code == 200

    detail_response = client.get(f'/api/leads/{lead_id}?business_id=biz1', headers=headers)
    assert detail_response.status_code == 200

    update_response = client.put(f'/api/leads/{lead_id}?business_id=biz1', json={'status': 'Qualified'}, headers=headers)
    assert update_response.status_code == 200

    delete_response = client.delete(f'/api/leads/{lead_id}?business_id=biz1', headers=headers)
    assert delete_response.status_code == 200
