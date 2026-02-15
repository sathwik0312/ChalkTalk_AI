# ChalkTalk AI 🎓

**Automated Lecture Quality Auditor**

ChalkTalk AI is a full-stack application that acts as a pedagogical copilot for professors. It analyzes video recordings of university lectures to distinguish between "passive teaching" (scrolling through PDFs) and "active teaching" (writing on the whiteboard, gesturing, and visual demonstrations).

## 🚀 The Core Mission

To provide actionable feedback to educators by quantifying engagement. The system outputs a **Pedagogical Engagement Score**, a time-stamped **Engagement Heatmap**, and an **Executive Summary** of feedback.

## ✨ Key Features

-   **Video Ingestion & Smart Sampling**: Extracts high-quality keyframes every 45 seconds and detects "high-motion" segments using OpenCV.
-   **Audio-Visual Fusion Brain**: Uses **Google Gemini 1.5 Flash** (Multimodal LLM) to analyze frames + audio context.
-   **Board vs. PDF Logic**: A specialized classifier using **Tesseract OCR** to distinguish between static slides (perfectly aligned text) and active handwriting (skewed/messy text).
-   **Engagement Heatmap**: A visual timeline marking "Whiteboard/Active" moments in Green and "PDF-only" moments in Red.
-   **Executive Summary**: A concise AI-generated critique for the professor.

## 🛠️ Tech Stack

-   **Frontend**: Next.js 15, React, Tailwind CSS, Recharts, Lucide React
-   **Backend**: Python, FastAPI, OpenCV, Google Generative AI SDK
-   **Infrastructure**: AWS S3/Lambda (Architecture compatible)
-   **Tools**: `uv` (Python dependency management), `npm`

## ⚡ Getting Started

### Prerequisites

-   **Node.js** (v18+)
-   **Python** (v3.10+)
-   **uv**: `pip install uv`
-   **Tesseract OCR**:
    -   macOS: `brew install tesseract`
    -   Ubuntu: `sudo apt-get install tesseract-ocr`
-   **Google API Key**: Get one from [Google AI Studio](https://aistudio.google.com/)

### 1. Backend Setup

```bash
cd backend

# Install dependencies
uv sync

# Configure API Key
# Create a .env file and add your key: GOOGLE_API_KEY=your_key_here
cp .env.example .env

# Run the server
uv run uvicorn main:app --reload --port 8000
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run the development server
npm run dev
```

### 3. Usage

1.  Open [http://localhost:3000](http://localhost:3000)
2.  Upload a lecture video file (`.mp4`)
3.  Wait for the analysis (Speed depends on video length)
4.  View your **Pedagogical Engagement Score** and **Heatmap**!

## 📄 License

MIT
