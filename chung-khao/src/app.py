import os
import sys
from pathlib import Path

# Thêm đường dẫn project vào sys.path
src_dir = Path(__file__).resolve().parent
chung_khao_dir = src_dir.parent
root_dir = chung_khao_dir.parent

for p in [str(root_dir), str(chung_khao_dir), str(src_dir)]:
    if p not in sys.path:
        sys.path.insert(0, p)

# Hỗ trợ deploy trên Render / Docker qua biến môi trường PYTHONPATH
pythonpath_env = os.environ.get("PYTHONPATH", "")
for p in pythonpath_env.split(os.pathsep):
    if p and p not in sys.path:
        sys.path.insert(0, p)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api.routes import router as api_router
from src.core.setting import settings

app = FastAPI(
    title="Trợ Lý AI Du Lịch Đắk Lắk (Web Desktop API)",
    description="API Gateway tích hợp LangChain, LangGraph và Pydantic giúp giải bài toán 'Đi đâu - Ăn gì - Chi phí thế nào'",
    version="1.0.0"
)

# Cho phép CORS toàn bộ để Frontend Web Desktop kết nối mượt mà
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Nhúng routes
app.include_router(api_router)


@app.get("/")
async def root():
    return {
        "message": "Chào mừng đến với API Trợ Lý AI Du Lịch Đắk Lắk!",
        "project": settings.PROJECT_NAME,
        "docs_url": "/docs"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
