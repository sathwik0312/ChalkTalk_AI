from fastapi import FastAPI, UploadFile, File, Form, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import shutil
import os
import json
import base64
import uuid
from datetime import datetime
from video_processor import process_video
from ai_analyzer import analyze_lecture
from video_downloader import download_video
from database import get_database, close_database, fix_id

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all for now to avoid port issues
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



class UrlRequest(BaseModel):
    url: str
    user_id: str

class UserSignup(BaseModel):
    email: str
    password: str
    name: str

class UserLogin(BaseModel):
    email: str
    password: str

@app.on_event("startup")
async def startup_db_client():
    get_database()

@app.on_event("shutdown")
async def shutdown_db_client():
    await close_database()

@app.post("/signup")
async def signup(user: UserSignup):
    db = get_database()
    
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    new_user = {
        "id": str(uuid.uuid4()),
        "email": user.email,
        "password": user.password, # In production, this MUST be hashed!
        "name": user.name,
        "created_at": datetime.now().isoformat()
    }
    
    await db.users.insert_one(new_user)
    
    return {"message": "User created successfully", "user": {"email": new_user["email"], "name": new_user["name"]}}

@app.post("/login")
async def login(user: UserLogin):
    db = get_database()
    
    # Find user
    u = await db.users.find_one({"email": user.email, "password": user.password})
    
    if u:
        return {"message": "Login successful", "user": {"id": u["id"], "email": u["email"], "name": u["name"]}}
            
    raise HTTPException(status_code=401, detail="Invalid email or password")

async def process_analysis_pipeline(file_path: str, original_filename: str, user_id: str):
    """
    Common pipeline for processing a video file, analyzing it, saving history, and cleaning up.
    """
    try:
        # Process the video
        frames, timestamps = process_video(file_path)
        
        # Analyze the content
        analysis_results = await analyze_lecture(frames, timestamps)
        
        # HACK: Handle potential error in analysis by checking structure
        if "score" not in analysis_results: 
             analysis_results = {
                "score": 0,
                "summary": ["Analysis failed"],
                "timeline": []
             }

        # --- History & Cleanup Logic ---
        
        # 1. Select a thumbnail (middle frame or first)
        thumbnail_base64 = ""
        analysis_id = str(uuid.uuid4())
        
        if frames:
            # Pick the middle frame to be representative
            middle_idx = len(frames) // 2
            thumbnail_src = frames[middle_idx]
            
            # Convert to Base64
            with open(thumbnail_src, "rb") as image_file:
                encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
                thumbnail_base64 = f"data:image/jpeg;base64,{encoded_string}"
            
            # Cleanup: Delete all extracted frames including thumbnail
            for frame in frames:
                if os.path.exists(frame):
                    os.remove(frame)
        
        # 2. Cleanup video file
        if os.path.exists(file_path):
            os.remove(file_path)
            
        # 3. Save to History
        # Use AI-generated title if available, otherwise use filename
        title = analysis_results.get("title")
        if not title:
            title = original_filename
            # Clean up extension
            if '.' in title:
                title = title.rsplit('.', 1)[0]
            
        description = analysis_results.get("summary", ["No summary available"])[0] if analysis_results.get("summary") else "No summary available"
        if isinstance(description, str) and len(description) > 100:
            description = description[:97] + "..."

        new_record = {
            "id": analysis_id,
            "user_id": user_id,
            "title": title,
            "description": description,
            "date": datetime.now().isoformat(),
            "score": analysis_results.get("score", 0),
            "thumbnail": thumbnail_base64,
            "analysis": analysis_results
        }
        
        db = get_database()
        await db.history.insert_one(new_record)
        
        return {"analysis": analysis_results, "record": fix_id(new_record)}
        
    except Exception as e:
        # Cleanup on error
        if os.path.exists(file_path):
            os.remove(file_path)
        raise e


@app.post("/upload")
async def upload_video(file: UploadFile = File(...), user_id: str = Form(...)):
    # Save the upload file
    file_location = f"temp_{file.filename}"
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    return await process_analysis_pipeline(file_location, file.filename, user_id)

@app.post("/analyze-url")
async def analyze_url(request: UrlRequest):
    # Download video
    file_path, title = download_video(request.url)
    
    if not file_path:
        raise HTTPException(status_code=400, detail="Failed to download video from URL")
        
    # Use title from downloader if strictly needed, but pipeline prefers AI title or filename
    # We pass the title as filename equivalent
    return await process_analysis_pipeline(file_path, title or "downloaded_video.mp4", request.user_id)

@app.get("/history")
async def get_history(user_id: str = None):
    db = get_database()
    query = {}
    if user_id:
        query["user_id"] = user_id
        
    history = []
    cursor = db.history.find(query).sort("date", -1)
    async for document in cursor:
        history.append(fix_id(document))
        
    return history

@app.get("/history/{id}")
async def get_history_item(id: str):
    db = get_database()
    item = await db.history.find_one({"id": id})
    if item:
        return fix_id(item)
    return {"error": "Item not found"}

@app.delete("/history/{id}")
async def delete_history_item(id: str):
    db = get_database()
    item = await db.history.find_one({"id": id})
    
    if item:
        await db.history.delete_one({"id": id})
        return {"message": "Record deleted"}
    
    raise HTTPException(status_code=404, detail="Item not found")

@app.get("/")
def read_root():
    return {"message": "Pedagogy-Vision Backend is operational"}
