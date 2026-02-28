import cv2
import numpy as np
import os
import logging

logger = logging.getLogger(__name__)

def process_video(video_path, output_dir="frames", sample_interval_seconds=10):
    """
    Extracts frames and performs basic motion analysis to pinpoint 'active' teaching moments.
    """
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise Exception(f"Could not open video: {video_path}")
        
    fps = cap.get(cv2.CAP_PROP_FPS)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    duration = total_frames / fps
    
    # We want a mix of regular interval sampling and high-motion sampling
    sample_rate = int(fps * sample_interval_seconds)
    
    frames_info = []
    prev_gray = None
    
    frame_count = 0
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
            
        if frame_count % sample_rate == 0:
            # Current timestamp
            ts = frame_count / fps
            timestamp_str = f"{int(ts // 60):02d}:{int(ts % 60):02d}"
            
            # Save frame
            frame_filename = f"frame_{frame_count:06d}.jpg"
            frame_path = os.path.join(output_dir, frame_filename)
            cv2.imwrite(frame_path, frame)
            
            # Basic motion detection vs previous sample
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            gray = cv2.GaussianBlur(gray, (21, 21), 0)
            
            motion_score = 0
            if prev_gray is not None:
                frame_delta = cv2.absdiff(prev_gray, gray)
                thresh = cv2.threshold(frame_delta, 25, 255, cv2.THRESH_BINARY)[1]
                motion_score = np.sum(thresh) / thresh.size
                
            prev_gray = gray
            
            frames_info.append({
                "path": frame_path,
                "timestamp": timestamp_str,
                "motion_score": float(motion_score)
            })
            
        frame_count += 1
        
    cap.release()
    return frames_info

def extract_audio(video_path, audio_path="lecture_audio.mp3"):
    """
    Placeholder for extracting audio for multimodal analysis.
    In a real system, we'd use moviepy or ffmpeg here.
    """
    # os.system(f"ffmpeg -i {video_path} -q:a 0 -map a {audio_path} -y")
    return audio_path
