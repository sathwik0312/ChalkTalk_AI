import yt_dlp
import os
import json
import asyncio
import logging
import cv2
from ai_analyzer import analyze_lecture

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("GoldenDataset")

# Curated Stanford Lectures representing different styles:
# 1. Heavy Whiteboard (Traditional ChalkTalk)
# 2. Heavy Slides (Passive Delivery)
STANFORD_VIDEOS = [
    {"name": "CS229_Machine_Learning", "url": "https://www.youtube.com/watch?v=jGwO_UgTS7I"}, # Andrew Ng
    {"name": "CS106A_Programming_Methodology", "url": "https://www.youtube.com/watch?v=KkMDCCdjyW8"}, # Mehran Sahami
]

def download_full(url, output_name):
    """Downloads the best available video file without ffmpeg dependencies."""
    ydl_opts = {
        'format': 'best[ext=mp4]/best',
        'outtmpl': f'golden_samples/{output_name}.%(ext)s',
    }
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])
    return f"golden_samples/{output_name}.mp4"

def process_video_segment(video_path, output_dir, start_sec=300, end_sec=600, interval=15):
    """Processes a specific segment of the video and extracts frames."""
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    cap = cv2.VideoCapture(video_path)
    fps = cap.get(cv2.CAP_PROP_FPS)
    
    start_frame = int(start_sec * fps)
    end_frame = int(end_sec * fps)
    interval_frames = int(interval * fps)
    
    frames_info = []
    cap.set(cv2.CAP_PROP_POS_FRAMES, start_frame)
    
    current_frame = start_frame
    while current_frame < end_frame:
        ret, frame = cap.read()
        if not ret:
            break
            
        if (current_frame - start_frame) % interval_frames == 0:
            ts = current_frame / fps
            timestamp_str = f"{int(ts // 60):02d}:{int(ts % 60):02d}"
            frame_filename = f"frame_{current_frame:06d}.jpg"
            frame_path = os.path.join(output_dir, frame_filename)
            cv2.imwrite(frame_path, frame)
            
            frames_info.append({
                "path": frame_path,
                "timestamp": timestamp_str
            })
            
        current_frame += 1
        
    cap.release()
    return frames_info

async def create_golden_dataset():
    if not os.path.exists("golden_samples"):
        os.makedirs("golden_samples")
    
    golden_data = []

    for video in STANFORD_VIDEOS:
        try:
            logger.info(f"Processing Golden Sample: {video['name']}")
            
            # 1. Download full (since we can't clip without ffmpeg)
            path = download_full(video['url'], video['name'])
            
            # 2. Process (Extract Frames from 5:00 to 10:00 mark)
            logger.info(f"Extracting frames for {video['name']}...")
            frames_info = process_video_segment(path, output_dir=f"frames/{video['name']}")
            
            # 3. Analyze (Gemini Multimodal)
            logger.info(f"Generating AI Analysis for {video['name']}...")
            analysis = await analyze_lecture(frames_info)
            
            golden_data.append({
                "video_meta": video,
                "analysis_results": analysis
            })
            
            # Cleanup the heavy video file
            if os.path.exists(path):
                os.remove(path)
            
            await asyncio.sleep(5) 
            
        except Exception as e:
            logger.error(f"Failed to process {video['name']}: {e}")

    with open("golden_dataset.json", "w") as f:
        json.dump(golden_data, f, indent=4)
    
    logger.info("✅ Golden Dataset Created Successfully!")

if __name__ == "__main__":
    asyncio.run(create_golden_dataset())
