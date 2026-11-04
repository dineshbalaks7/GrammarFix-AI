
from fastapi.testclient import TestClient
from unittest.mock import patch

from app.main import app

client = TestClient(app)


def test_home_endpoint():
    response = client.get("/")

    assert response.status_code == 200
    assert response.json()["status"] == "running"


def test_health_endpoint():
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_empty_text():
    response = client.post(
        "/correct",
        json={"text": "   "}
    )

    assert response.status_code == 400


def test_missing_text():
    response = client.post(
        "/correct",
        json={}
    )

    assert response.status_code == 422


def test_successful_grammar_correction():

    mock_result = {
        "corrected_text": "He goes to school.",
        "mistakes": [
            {
                "original": "go",
                "corrected": "goes",
                "explanation": "Subject-verb agreement."
            }
        ]
    }

    with patch(
        "app.main.correct_grammar",
        return_value=mock_result
    ):
        response = client.post(
            "/correct",
            json={"text": "He go to school."}
        )

    assert response.status_code == 200
    assert response.json() == mock_result
