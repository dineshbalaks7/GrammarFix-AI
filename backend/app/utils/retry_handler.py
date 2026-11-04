import time
import random
import logging
import httpx

from google.genai import errors

logger = logging.getLogger(__name__)
RETRYABLE_STATUS_CODES = {
    429, 500, 502, 503, 504
}
def retry_request(function, max_retries=3):

    for attempt in range(max_retries):

        try:
            return function()

        except errors.APIError as e:

            if e.code not in RETRYABLE_STATUS_CODES:
                raise

            if attempt == max_retries - 1:
                raise

        except (httpx.TimeoutException, httpx.NetworkError):

            if attempt == max_retries - 1:
                raise

        wait_time = (2 ** attempt) + random.uniform(0, 1)

        logger.warning(
            "Request failed. Retry %s/%s after %.2f seconds",
            attempt + 1,
            max_retries,
            wait_time
        )

        time.sleep(wait_time)