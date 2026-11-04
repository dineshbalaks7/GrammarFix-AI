
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.utils.error_handler import logger, handle_api_error
from app.schemas import GrammarRequest, GrammarResult
from app.services.grammar_service import correct_grammar
from app.utils.error_handler import logger


# Initialize FastAPI
app = FastAPI(
    title="GrammarFix AI",
    description="AI-powered grammar correction application",
    version="1.0.0"
)


# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://grammarfix-seven.vercel.app","http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Root endpoint
@app.get("/")
def home():
    return {
        "message": "Welcome to GrammarFix AI API",
        "status": "running"
    }


# Health endpoint
@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "application": "GrammarFix AI"
    }


# Grammar correction endpoint
@app.post("/correct", response_model=GrammarResult)
def correct_text(request: GrammarRequest):

    try:
        result = correct_grammar(request.text, request.mode)
        return result

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

    except HTTPException:
        raise

    except Exception as e:
        handle_api_error(e)

