# Backend Dockerfile for Dak Lak Travel AI Assistant
FROM python:3.9-slim

# Prevent python from writing pyc files and buffering stdout/stderr
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/app

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements & install python packages
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Install fastapi uvicorn langchain langgraph explicitly
RUN pip install --no-cache-dir fastapi uvicorn langchain langgraph

# Copy application source code
COPY src/ /app/src/

# Expose port 8000
EXPOSE 8000

# Run FastAPI app
CMD ["uvicorn", "src.app:app", "--host", "0.0.0.0", "--port", "8000"]
