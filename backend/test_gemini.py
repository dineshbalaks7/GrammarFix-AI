from app.config import client, GEMINI_MODEL

print("Testing:", GEMINI_MODEL)

try:
    response = client.models.generate_content(
        model=GEMINI_MODEL,
        contents="Correct this sentence: She go to college."
    )

    print("SUCCESS!")
    print(response.text)

except Exception as error:
    print("FAILED:", repr(error))