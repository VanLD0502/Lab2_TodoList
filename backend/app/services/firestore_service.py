from google.cloud import firestore
from datetime import datetime
from app.firebase_config import db

def create_task(user_id: str, title: str, due_date: str = None):
    task_ref = db.collection("tasks").document()
    task_data = {
        "id": task_ref.id,
        "user_id": user_id,
        "title": title,
        "completed": False,
        "created_at": datetime.utcnow().isoformat(),
        "due_date": due_date  # format: yyyy-MM-ddThh:mm
    }
    task_ref.set(task_data)
    return task_data

def get_tasks(user_id: str):
    tasks_ref = db.collection("tasks")
    # Query tasks for user, ordered by created_at
    query = tasks_ref.where("user_id", "==", user_id).order_by("created_at", direction=firestore.Query.DESCENDING)
    docs = query.stream()
    
    tasks = []
    for doc in docs:
        data = doc.to_dict()
        # Đảm bảo luôn có trường 'id' kể cả với dữ liệu cũ
        if "id" not in data:
            data["id"] = doc.id
        tasks.append(data)
    
    return tasks

def update_task(task_id: str, user_id: str, update_data: dict):
    task_ref = db.collection("tasks").document(task_id)
    doc = task_ref.get()
    
    if not doc.exists or doc.to_dict().get("user_id") != user_id:
        return None
        
    task_ref.update(update_data)
    # Lấy lại dữ liệu mới nhất
    updated_doc = task_ref.get().to_dict()
    if "id" not in updated_doc:
        updated_doc["id"] = task_id
    return updated_doc

def delete_task(task_id: str, user_id: str):
    task_ref = db.collection("tasks").document(task_id)
    doc = task_ref.get()
    
    if not doc.exists or doc.to_dict().get("user_id") != user_id:
        return False
        
    task_ref.delete()
    return True
