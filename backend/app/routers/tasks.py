from fastapi import APIRouter, Depends, HTTPException, Header
from typing import List
from app.schemas.task import Task, TaskCreate, TaskUpdate
from app.services import firestore_service
from app.routers.auth import get_current_user

router = APIRouter()

@router.get("", response_model=List[Task])
async def get_tasks(user: dict = Depends(get_current_user)):
    try:
        return firestore_service.get_tasks(user["uid"])
    except Exception as e:
        print(f"ERROR IN GET_TASKS: {str(e)}") # In lỗi chi tiết ra terminal
        raise HTTPException(status_code=500, detail=str(e))

@router.post("", response_model=Task)
async def create_task(task: TaskCreate, user: dict = Depends(get_current_user)):
    try:
        return firestore_service.create_task(user["uid"], task.title, task.due_date)
    except Exception as e:
        print(f"ERROR IN CREATE_TASK: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{task_id}", response_model=Task)
async def update_task(task_id: str, task_update: TaskUpdate, user: dict = Depends(get_current_user)):
    try:
        updated_task = firestore_service.update_task(task_id, user["uid"], task_update.dict(exclude_unset=True))
        if not updated_task:
            raise HTTPException(status_code=404, detail="Task not found or unauthorized")
        return updated_task
    except Exception as e:
        print(f"ERROR IN UPDATE_TASK: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{task_id}")
async def delete_task(task_id: str, user: dict = Depends(get_current_user)):
    try:
        success = firestore_service.delete_task(task_id, user["uid"])
        if not success:
            raise HTTPException(status_code=404, detail="Task not found or unauthorized")
        return {"status": "success"}
    except Exception as e:
        print(f"ERROR IN DELETE_TASK: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
