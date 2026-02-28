import google.generativeai as genai
import os
import PIL.Image
import json
import logging
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger(__name__)

# Configure model for Gemini 2.5 Flash
# Note: Using multimodal capabilities for Pedagogy Analysis
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = genai.GenerativeModel('gemini-2.0-flash', generation_config={"response_mime_type": "application/json"})

async def analyze_lecture(frames_info):
    """
    Enhanced analysis using Gemini 2.0 Flash (Multimodal).
    Identifies 'ChalkTalk' moments (whiteboard writing) vs Passive delivery.
    """
    
    prompt = """
    You are an expert Pedagogical Consultant. I will provide you with a series of frames from a lecture.
    
    Analyze the frames and provide a JSON report on the professor's teaching effectiveness.
    
    Key Metrics to observe:
    1. Whiteboard Usage: Is the professor writing (ChalkTalk)?
    2. Body Language: Gesturing, facing students vs facing the board.
    3. Visual Aids: Usage of slides vs hand-drawn diagrams.
    
    Return a JSON object with this exact structure:
    {
        "lecture_meta": {
            "title": "catchy title",
            "engagement_score": number (1-100),
            "primary_style": "Visual / Auditory / Kinesthetic"
        },
        "pedagogical_feedback": {
            "strengths": ["list of 3 points"],
            "weaknesses": ["list of 3 points"],
            "action_plan": "A short tactical paragraph to improve the next lecture"
        },
        "engagement_timeline": [
            {
                "timestamp": "MM:SS",
                "state": "Active (Writing) / Engaging (Speaking) / Passive (Slide Reading)",
                "reasoning": "brief detail"
            }
        ]
    }
    """
    
    # Bundle frames with their metadata for the model
    # We select up to 15 frames to stay within reasonable token/processing limits
    selected_frames = frames_info[:15]
    
    contents = [prompt]
    for frame in selected_frames:
        img = PIL.Image.open(frame['path'])
        contents.append(f"Timestamp: {frame['timestamp']}")
        contents.append(img)
            
    try:
        response = model.generate_content(contents)
        return json.loads(response.text)
    except Exception as e:
        logger.error(f"multimodal analysis failed: {e}")
        return {"error": str(e)}
