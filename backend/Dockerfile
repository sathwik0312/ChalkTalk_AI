FROM python:3.11-slim

# Install system dependencies
# - ffmpeg: for yt-dlp video processing
# - tesseract-ocr: for text extraction
# - libgl1-mesa-glx: for opencv
RUN apt-get update && apt-get install -y \
    ffmpeg \
    tesseract-ocr \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv

WORKDIR /app

# Copy dependency files first
COPY backend/pyproject.toml .
COPY uv.lock .

# Install dependencies
# Using --system to install into system python environment since we are in a container
# (uv sync creates .venv by default, checking if we need to adjust this)
RUN uv sync --frozen --no-cache

# Copy application code
COPY backend/ .

# Expose port
EXPOSE 8000

# Run the application
# We use the system python environment since we used --system above? 
# Wait, uv sync creates a .venv by default. 
# Better to use `uv run` which handles the venv automatically.
CMD ["uv", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
