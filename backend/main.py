from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv

print("Starting Dholuo AI Chatbot backend...")

# Load environment variables
load_dotenv()
print("Environment variables loaded")

app = FastAPI(title=os.getenv("APP_NAME", "Dholuo AI Chatbot"))

# Configure CORS for local development
origins = [
    "http://localhost:5173",      # Vite default
    "http://127.0.0.1:5173",     # Alternate local address
    "http://localhost:3000",      # In case you use npm run dev -- --port 3000
    "http://127.0.0.1:3000",     # Alternate port local address
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,        # Use origins list defined above
    allow_credentials=True,       # Allow cookies (if needed later)
    allow_methods=["*"],         # Allow all HTTP methods
    allow_headers=["*"],         # Allow all headers
    expose_headers=["*"],        # Expose all response headers
    max_age=3600,               # Cache preflight requests for 1 hour
)

class Message(BaseModel):
    text: str

def dholuo_ai_response(text: str) -> str:
    """
    Enhanced rule-based Dholuo AI response function with more phrases and context
    """
    text = text.lower()
    
    # Greetings
    if "nango" in text or "hello" in text or "hi" in text:
        return "Nango! Abet maber, in bende? (Hello! I'm fine, how are you?)"
    elif "oyawore" in text or "good morning" in text:
        return "Oyawore! In ango? (Good morning! How are you?)"
    elif "oimore" in text or "good afternoon" in text:
        return "Oimore! Odhi nade? (Good afternoon! How's it going?)"
    
    # Well-being and common phrases
    elif "ber" in text or "fine" in text:
        return "Ber ahinya! Ang'o ma inyalo paro kawacho? (Very good! What would you like to talk about?)"
    elif "ere" in text or "where" in text:
        return "An ka, to in ere? (I am here, where are you?)"
    elif "ango" in text or "what" in text:
        return "Ang'o ma idwaro ng'eyo? (What would you like to know?)"
    elif "kama ber" in text or "good" in text:
        return "Ee, mano ber ahinya! (Yes, that's very good!)"
    
    # Default responses with translations
    else:
        responses = [
            "Wach maber! To wach mane ma idwaro wacho? (Good point! What else would you like to say?)",
            "Ok awinj maber. Inyalo loso wach mamoko? (I don't understand well. Can you say it differently?)",
            "Nyisa gimoro. Ang'o ma itimo sani? (Tell me something. What are you doing now?)",
            "Wach maber! To wach mane ma idwaro wacho? (Nice! What else would you like to discuss?)"
        ]
        from random import choice
        return choice(responses)

@app.get("/")
async def root():
    return {"message": "Dholuo AI Chatbot backend active"}

@app.get("/health")
async def health_check():
    return {"status": "ok"}

@app.post("/ai")
async def get_ai_response(message: Message):
    try:
        response = dholuo_ai_response(message.text)
        return {"reply": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    # Run with: python main.py
    # Using a different port (3000) to avoid common port conflicts.
    try:
        import uvicorn
        print("Starting Uvicorn via python main.py on 127.0.0.1:3000")
        uvicorn.run("main:app", host="127.0.0.1", port=3000, reload=True)
    except Exception as exc:
        # Print exception to help debugging if startup fails when run directly
        print("Failed to start server via python main.py:", exc)
        raise