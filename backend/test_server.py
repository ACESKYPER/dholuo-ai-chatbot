from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Message(BaseModel):
    text: str

@app.get("/")
async def root():
    return {"message": "Test server active"}

@app.post("/ai")
async def get_ai_response(message: Message):
    return {"reply": f"Echo: {message.text}"}