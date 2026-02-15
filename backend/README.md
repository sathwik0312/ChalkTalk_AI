# ChalkTalk AI Backend

Process lecture videos to analyze pedagogical engagement.

## Prerequisites

- **Python 3.10+**
- **uv** (for dependency management)
- **Tesseract OCR** (for text analysis)
  - macOS: `brew install tesseract`
  - Ubuntu: `sudo apt-get install tesseract-ocr`
- **Google API Key** (for Gemini)

## Setup

1.  Initialize properties:
    ```bash
    uv sync
    ```

2.  Set up environment variables:
    Create a `.env` file in `backend/`:
    ```
    GOOGLE_API_KEY=your_key_here
    ```

## Running the Server

```bash
uv run uvicorn main:app --reload
```

## API

- `POST /upload`: Upload a video file for analysis.
