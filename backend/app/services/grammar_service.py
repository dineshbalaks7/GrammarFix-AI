
from google.genai import types
from app.config import client, GEMINI_MODEL
from app.schemas import GrammarResult
from app.prompts import build_system_prompt
from app.utils.error_handler import logger

import time


def correct_grammar(user_text: str, mode: str = "correct"):

    logger.info("Grammar correction request started")

    # 1. Validate input
    if not user_text or not user_text.strip():
        raise ValueError("Please enter some text.")

    # 2. Configure Gemini
    config = types.GenerateContentConfig(
        system_instruction=build_system_prompt(mode),
        response_mime_type="application/json",
        response_schema=GrammarResult,
        max_output_tokens=2048
    )

    try:
        # 3. Measure Gemini generation time
        generation_start = time.perf_counter()

        response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=user_text.strip(),
            config=config
        )

        generation_time = time.perf_counter() - generation_start

        logger.info(
            "Gemini generation time: %.2f seconds",
            generation_time
        )

        # 4. Check response
        if not response.text:
            raise ValueError("Gemini returned an empty response.")

        # 5. Measure JSON validation time
        validation_start = time.perf_counter()

        result = GrammarResult.model_validate_json(response.text)

        validation_time = time.perf_counter() - validation_start

        logger.info(
            "JSON validation time: %.4f seconds",
            validation_time
        )

        logger.info(
            "Total processing time: %.2f seconds",
            generation_time + validation_time
        )

        logger.info("Grammar correction completed successfully")

        return result

    except Exception:
        logger.exception("Grammar correction failed")
        raise
