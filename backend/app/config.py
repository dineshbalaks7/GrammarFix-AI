
import os
import logging

from dotenv import load_dotenv
from google import genai
from google.genai import types


# 1. Load environment variables
load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

GEMINI_MODEL = os.getenv(
    "GEMINI_MODEL",
    "gemini-3.5-flash-lite"
).strip()


# 2. Validate configuration
if not GEMINI_API_KEY:
    raise ValueError(
        "GEMINI_API_KEY is missing. "
        "Please configure it in your .env file."
    )

if not GEMINI_MODEL:
    raise ValueError("GEMINI_MODEL is missing.")


# 3. Logging configuration
logger = logging.getLogger("grammarfix")


# 4. Gemini HTTP configuration
http_options = types.HttpOptions(
    timeout=120000,
    retry_options=types.HttpRetryOptions(
        attempts=3,
        initial_delay=1,
        max_delay=10,
        exp_base=2,
        http_status_codes=[
            408, 429, 500, 502, 503, 504
        ]
    )
)


# 5. Initialize Gemini client
client = genai.Client(
    api_key=GEMINI_API_KEY,
    http_options=http_options
)


logger.info("GrammarFix configuration loaded successfully")
logger.info("Gemini model configured: %s", GEMINI_MODEL)
