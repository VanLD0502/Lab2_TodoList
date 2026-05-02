from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class TaskBase(BaseModel):
    title: str
    due_date: Optional[str] = None # format: yyyy-MM-ddThh:mm

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    due_date: Optional[str] = None
    completed: Optional[bool] = None

class Task(TaskBase):
    id: str
    user_id: str
    completed: bool
    created_at: str

    class Config:
        from_attributes = True
