
import time

from google.genai import types

from app.config import client, GEMINI_MODEL
from app.schemas import GrammarResult
from app.prompts import build_system_prompt
from app.utils.error_handler import logger


def correct_grammar(user_text: str, mode: str = "correct"):

    logger.info("Grammar correction request started")

    if not user_text or not user_text.strip():
        raise ValueError("Please enter some text.")

    config = types.GenerateContentConfig(
        system_instruction=build_system_prompt(mode),
        response_mime_type="application/json",
        response_schema=GrammarResult,
        max_output_tokens=1024,
        temperature=0.1
    )

    try:
        start_time = time.perf_counter()

        response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=user_text.strip(),
            config=config
        )

        generation_time = time.perf_counter() - start_time

        logger.info(
            "Gemini generation time: %.2f seconds",
            generation_time
        )

        if not response.text:
            raise ValueError("Gemini returned an empty response.")

        validation_start = time.perf_counter()

        result = GrammarResult.model_validate_json(response.text)

        validation_time = time.perf_counter() - validation_start

        total_time = time.perf_counter() - start_time

        logger.info(
            "JSON validation time: %.4f seconds",
            validation_time
        )

        logger.info(
            "Total processing time: %.2f seconds",
            total_time
        )

        logger.info("Grammar correction completed successfully")

        return result

    except Exception:
        logger.exception("Grammar correction failed")
        raise
