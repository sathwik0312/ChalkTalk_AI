from fastapi import FastAPI, UploadFile, File, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import uuid
import shutil
from video_processor import process_video
from ai_analyzer import analyze_lecture
from database import save_analysis, get_user_history # Assuming these exist in your db logic
from payments import router as payment_router
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ChalkTalkPro")

app = FastAPI(title="ChalkTalk Pro API")

# Production CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Update to your Vercel URL in final step
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(payment_router)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.get("/health")
def health():
    return {"status": "healthy", "service": "ChalkTalk Pro"}

@app.post("/analyze")
async def start_analysis(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    """
    Production entry point for lecture analysis.
    Handles upload, kicks off background processing, and returns a tracking ID.
    """
    job_id = str(uuid.uuid4())
    file_path = os.path.join(UPLOAD_DIR, f"{job_id}_{file.filename}")
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    background_tasks.add_task(run_full_pipeline, job_id, file_path)
    
    return {
        "job_id": job_id,
        "status": "processing",
        "message": "Analysis started in background"
    }

async def run_full_pipeline(job_id: str, video_path: str):
    try:
        # 1. Video Processing (Frame Extraction & Motion)
        logger.info(f"Job {job_id}: Processing video...")
        frames_info = process_video(video_path, output_dir=f"frames/{job_id}", sample_interval_seconds=15)
        
        # 2. AI Analysis
        logger.info(f"Job {job_id}: Running AI Analysis...")
        results = await analyze_lecture(frames_info)
        
        # 3. Persistence
        logger.info(f"Job {job_id}: Saving results...")
        save_analysis(job_id, results)
        
        # 4. Cleanup
        if os.path.exists(video_path):
            os.remove(video_path)
            
    except Exception as e:
        logger.error(f"Job {job_id} Failed: {e}")
        save_analysis(job_id, {"error": str(e), "status": "failed"})

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
