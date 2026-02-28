import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

def test_api_key():
    api_key = os.getenv("GOOGLE_API_KEY")
    print(f"Testing API Key: {api_key}")
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-2.0-flash')
    try:
        response = model.generate_content("Say hello")
        print(f"✅ Success: {response.text}")
    except Exception as e:
        print(f"❌ Failed: {e}")

if __name__ == "__main__":
    test_api_key()
