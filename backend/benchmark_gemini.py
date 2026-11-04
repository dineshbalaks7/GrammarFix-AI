
import time

from app.config import client

MODEL = "gemini-3.1-flash-lite"

prompt = """
Correct this sentence:
Yesterday I am going to college and meet my friends.
I doesn't like the weather.

Return only the corrected sentence.
"""

for i in range(5):
    start = time.perf_counter()

    try:
        response = client.interactions.create(
            model=MODEL,
            input=prompt
        )

        elapsed = time.perf_counter() - start

        print(f"\nTest {i + 1}")
        print(f"Time: {elapsed:.2f} seconds")
        print(response.output_text)

    except Exception as e:
        elapsed = time.perf_counter() - start
        print(f"\nTest {i + 1} failed after {elapsed:.2f}s")
        print(type(e).__name__, str(e))
