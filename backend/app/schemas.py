
from typing import Literal

from pydantic import BaseModel, Field


class Mistake(BaseModel):
    original: str
    corrected: str
    explanation: str


class GrammarResult(BaseModel):
    corrected_text: str
    mistakes: list[Mistake]


class GrammarRequest(BaseModel):
    text: str = Field(
        min_length=1,
        max_length=10000
    )
    mode: Literal[
        "correct",
        "professional",
        "clear"
    ] = "correct"
