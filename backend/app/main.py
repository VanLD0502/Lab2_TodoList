from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, tasks
import uvicorn

app = FastAPI(title="Master To Do API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers with prefixes
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(tasks.router, prefix="/tasks", tags=["tasks"])

@app.get("/")
async def root():
    return {"message": "Welcome to Master To Do API"}

from app.firebase_config import is_firebase_initialized, firebase_error

@app.get("/health")
async def health_check():
    if not is_firebase_initialized:
        return {
            "status": "unhealthy",
            "reason": "Firebase initialization failed",
            "error": firebase_error
        }
    return {
        "status": "healthy",
        "firebase": "connected"
    }

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
