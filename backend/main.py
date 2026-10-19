# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# THIS IS CRUCIAL: React runs on port 5173, FastAPI runs on 8000.
# Without CORS, the browser will block the request.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, change this to your actual domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define what the frontend is sending
class SketchPayload(BaseModel):
    code: str

@app.post("/compile")
async def compile_sketch(payload: SketchPayload):
    print(f"Received code:\n{payload.code}")
    
    # We aren't compiling yet. We just want to see a 200 OK.
    return {
        "status": "success",
        "message": "Code received successfully by the backend!",
        "hex_file": "fake_hex_data_placeholder"
    }