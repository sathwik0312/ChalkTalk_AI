from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
from video_processor import process_video
from ai_analyzer import analyze_lecture

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload")
async def upload_video(file: UploadFile = File(...)):
    # Save the upload file
    file_location = f"temp_{file.filename}"
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Process the video
    frames, timestamps = process_video(file_location)
    
    # Analyze the content
    analysis_results = await analyze_lecture(frames, timestamps)
    
    # Clean up (in production, use proper temp file management)
    os.remove(file_location)
    
    return {"analysis": analysis_results}

@app.get("/")
def read_root():
    return {"message": "Pedagogy-Vision Backend is operational"}
