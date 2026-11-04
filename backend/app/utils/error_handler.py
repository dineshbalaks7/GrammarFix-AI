
import logging
import httpx
from fastapi import HTTPException
from pathlib import Path
from pydantic import ValidationError

# Locate backend directory
BASE_DIR = Path(__file__).resolve().parents[2]

# Create logs directory
LOG_DIR = BASE_DIR / "logs"
LOG_DIR.mkdir(exist_ok=True)

# Log file location
LOG_FILE = LOG_DIR / "app.log"

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(name)s - %(message)s",
    handlers=[
        logging.FileHandler(LOG_FILE, encoding="utf-8"),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger("grammarfix")

def handle_api_error(error: Exception):

    logger.error(
        "Grammar correction failed: %s",
        error,
        exc_info=error.__traceback__ is not None
    )

    # Invalid Gemini response
    if isinstance(error, ValidationError):
        raise HTTPException(
        status_code=502,
        detail="The AI service returned an invalid response. Please try again."
    )

    # Gemini authentication and permission errors
    if getattr(error, "code", None) in (401, 403):
        logger.error("Gemini authentication or permission error")
        raise HTTPException(
            status_code=503,
            detail="The grammar correction service is not properly configured."
    )

    # Network timeout
    if isinstance(error, httpx.TimeoutException):
        raise HTTPException(
            status_code=504,
            detail="The grammar correction request timed out. Please try again."
        )

    # Network connection failure
    if isinstance(error, httpx.NetworkError):
        raise HTTPException(
            status_code=503,
            detail="Unable to connect to the grammar correction service."
        )

    # Gemini rate limit
    if getattr(error, "code", None) == 429:
        raise HTTPException(
            status_code=429,
            detail="Too many requests. Please try again later."
        )

    # Gemini server-side errors
    if getattr(error, "code", None) in (500, 502, 503, 504):
        raise HTTPException(
            status_code=503,
            detail="Grammar correction service is temporarily unavailable."
        )

    # Other unexpected errors
    raise HTTPException(
        status_code=500,
        detail="Something went wrong. Please try again."
    )
