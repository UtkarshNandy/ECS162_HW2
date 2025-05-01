import os
import pytest
from app import app
import werkzeug

# give it some placeholder version so Flask’s test client can read it
werkzeug.__version__ = "2.3.0"

@pytest.fixture(autouse=True)
def set_env(monkeypatch):
    # ensure we control the key
    monkeypatch.setenv('NYT_API_KEY', 'TESTKEY123')

@pytest.fixture
def client():
    return app.test_client()

def test_get_key_returns_api_key(client):
    resp = client.get('/api/key')
    assert resp.status_code == 200
    payload = resp.get_json()
    assert payload == {'apiKey': 'TESTKEY123'}
