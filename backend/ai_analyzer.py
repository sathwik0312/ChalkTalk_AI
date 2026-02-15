import google.generativeai as genai
import os
import PIL.Image
import json
from dotenv import load_dotenv

load_dotenv()

# Configure the SDK with your API key
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# Configure model for JSON output
model = genai.GenerativeModel('gemini-2.5-flash', generation_config={"response_mime_type": "application/json"})

async def analyze_lecture(frames, timestamps):
    # Prepare the prompt
    prompt = """
    Analyze these frames from a lecture video. Return a JSON object with the following structure:
    {
        "title": string (A catchy, descriptive title for the lecture),
        "score": number (0-10 pedagogical engagement score),
        "summary": [string] (3-5 bullet points of executive summary/feedback),
        "suggestions": [string] (3-5 specific topics/areas where the professor could have explained better or used more active teaching),
        "timeline": [
            {
                "time": string (timestamp in MM:SS format),
                "type": string ("active" or "static")
            }
        ]
    }
    
    Timestamps provided for frames: """ + str(timestamps) + """
    
    For "timeline", map each frame analysis to the corresponding timestamp.
    "active" = professor writing, gesturing, or speaking with face visible.
    "static" = static slide or screen share only.
    """
    
    # Load images
    image_parts = []
    try:
        for frame_path in frames:
            img = PIL.Image.open(frame_path)
            image_parts.append(img)
            
        # Call the model
        response = model.generate_content([prompt, *image_parts])
        
        # Parse result
        result = json.loads(response.text)
        return result
        
    except Exception as e:
        print(f"AI Analysis Error: {e}")
        # Fallback error response
        return {
            "score": 0,
            "summary": ["Error analyzing video.", str(e)],
            "suggestions": [],
            "timeline": []
        }
