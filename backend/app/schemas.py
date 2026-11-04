from pydantic import BaseModel

class Mistake(BaseModel):
    original: str
    corrected: str
    explanation: str


class GrammarResult(BaseModel):
    corrected_text: str
    mistakes: list[Mistake]


class GrammarRequest(BaseModel):
    text: str
    mode: str = "correct"
