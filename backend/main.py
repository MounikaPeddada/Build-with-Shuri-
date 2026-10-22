# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import subprocess
import tempfile
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SketchPayload(BaseModel):
    code: str

@app.post("/compile")
async def compile_sketch(payload: SketchPayload):
    print("Received code for compilation...")
    
    with tempfile.TemporaryDirectory() as temp_dir:
        # 1. Create a subfolder named 'sketch' (must match the .ino file name)
        sketch_folder = os.path.join(temp_dir, "sketch")
        os.makedirs(sketch_folder, exist_ok=True)
        
        # 2. Write the code inside 'sketch/sketch.ino'
        sketch_path = os.path.join(sketch_folder, "sketch.ino")
        with open(sketch_path, "w") as f:
            f.write(payload.code)
        
        # 3. Compile using arduino-cli, pointing to the FOLDER, not the file
        cmd = [
            "arduino-cli", "compile",
            "--fqbn", "arduino:avr:uno",
            "--output-dir", temp_dir,
            sketch_folder  # <--- Pass the folder path here
        ]
        
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        if result.returncode != 0:
            print("Compilation error:", result.stderr)
            return {
                "status": "error",
                "message": result.stderr
            }
        
        # 4. Read the generated .hex file
        hex_path = os.path.join(temp_dir, "sketch.ino.hex")
        if not os.path.exists(hex_path):
            return {"status": "error", "message": "Hex file was not generated."}
            
        with open(hex_path, "r") as f:
            hex_content = f.read()
            
        print("Compilation successful!")
        return {
            "status": "success",
            "hex_content": hex_content
        }