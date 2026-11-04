
import httpx
import pytest

from fastapi import HTTPException
from pydantic import ValidationError

from app.schemas import GrammarResult
from app.utils.error_handler import handle_api_error


class SimulatedAPIError(Exception):
    def __init__(self, code):
        self.code = code
        super().__init__(f"Simulated API error: {code}")


def test_invalid_gemini_response():
    with pytest.raises(ValidationError) as error:
        GrammarResult.model_validate({"corrected_text": "Hello"})

    with pytest.raises(HTTPException) as exc:
        handle_api_error(error.value)

    assert exc.value.status_code == 502


@pytest.mark.parametrize(
    "error, expected_status",
    [
        (SimulatedAPIError(401), 503),
        (SimulatedAPIError(403), 503),
        (SimulatedAPIError(429), 429),
        (SimulatedAPIError(500), 503),
        (httpx.ReadTimeout("Timeout"), 504),
        (httpx.ConnectError("Connection failed"), 503),
    ]
)
def test_api_errors(error, expected_status):
    with pytest.raises(HTTPException) as exc:
        handle_api_error(error)

    assert exc.value.status_code == expected_status
