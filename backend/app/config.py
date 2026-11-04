
import os
import logging

from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv(
    "GEMINI_MODEL",
    "gemini-3.5-flash-lite"
).strip()

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY is missing.")

if not GEMINI_MODEL:
    raise ValueError("GEMINI_MODEL is missing.")

logger = logging.getLogger("grammarfix")

# HTTP configuration
http_options = types.HttpOptions(
    timeout=30000,
    retry_options=types.HttpRetryOptions(
        attempts=2,
        initial_delay=1,
        max_delay=3,
        exp_base=2,
        http_status_codes=[
            408,
            500,
            502,
            503,
            504
        ]
    )
)

# Gemini client
client = genai.Client(
    api_key=GEMINI_API_KEY,
    http_options=http_options
)

logger.info("GrammarFix configuration loaded")
logger.info("Gemini model: %s", GEMINI_MODEL)
