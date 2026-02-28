from typing import List, Dict, Any
import os
import google.generativeai as genai
from google.generativeai import types
import PIL.Image
import json
import logging
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger(__name__)

# Configure Google Gemini
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# Use Gemini 2.0 Flash for speed and multimodal capabilities
model = genai.GenerativeModel('gemini-2.0-flash')

async def analyze_lecture(frames_info: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Production-grade multimodal analysis of lecture frames.
    Identifies pedagogical style, whiteboard usage, and engagement.
    """
    
    prompt = """
    You are a World-Class Pedagogical Consultant. Analyze these chronological frames from a university lecture.
    
    Provide a comprehensive pedagogical audit in JSON format:
    {
        "lecture_meta": {
            "title": "catchy and descriptive title",
            "engagement_score": number (1-100),
            "primary_style": "ChalkTalk / Slide-Based / Socratic / Hybrid"
        },
        "pedagogical_analysis": {
            "whiteboard_presence": "High/Medium/Low - detail the frequency and clarity of writing",
            "student_focus": "Does the professor face the students or the board more?",
            "pacing": "Analyze the speed of delivery based on visual transitions"
        },
        "feedback": {
            "strengths": ["3 specific positive observations"],
            "areas_for_improvement": ["3 specific tactical changes"],
            "pro_tip": "One 'Golden Rule' for this specific professor"
        },
        "engagement_heatmap": [
            {
                "timestamp": "MM:SS",
                "activity_level": "Active (Writing) / Engaging (Gesturing) / Passive (Static)",
                "observation": "what is happening here?"
            }
        ]
    }
    
    Focus specifically on the 'ChalkTalk' aspect: Is the act of writing helping or hindering the flow?
    """
    
    # Selection logic: Max 15 frames distributed across the lecture to stay in budget
    if len(frames_info) > 15:
        step = len(frames_info) // 15
        selected = frames_info[::step][:15]
    else:
        selected = frames_info
    
    contents = [prompt]
    for frame in selected:
        try:
            img = PIL.Image.open(frame['path'])
            contents.append(f"Timestamp: {frame['timestamp']}")
            contents.append(img)
        except Exception as e:
            logger.error(f"Failed to load frame {frame['path']}: {e}")

    try:
        # Use controlled JSON output
        response = model.generate_content(
            contents,
            generation_config=genai.GenerationConfig(
                response_mime_type="application/json",
            )
        )
        return json.loads(response.text)
    except Exception as e:
        logger.error(f"Gemini Analysis Failed: {e}")
        return {
            "error": "Analysis failed",
            "details": str(e),
            "status": "partial_success" if len(contents) > 1 else "failed"
        }
