import React, { useState } from "react";
import { 
  Calendar, 
  Edit3, 
  Trash2, 
  Check, 
  AlertCircle,
  Clock
} from "lucide-react";

const TaskCard = ({ task, onToggle, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);

  const isCompleted = task.completed;
  const isOverdue = !isCompleted && task.due_date && new Date(task.due_date) < new Date();

  const handleUpdate = () => {
    if (editedTitle.trim() && editedTitle !== task.title) {
      onUpdate(task.id, { title: editedTitle });
    }
    setIsEditing(false);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(dateStr));
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    return new Intl.DateTimeFormat('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(new Date(dateStr));
  };

  return (
    <div className={`task-card bg-white p-4 rounded-xl border mb-3 flex items-center gap-4 animate-fade-in group ${isCompleted ? 'border-surface-container-high opacity-80' : 'border-surface-container shadow-sm hover:shadow-md'}`}>
      <div className="relative flex items-center justify-center">
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={() => onToggle(task.id, !isCompleted)}
          className="w-6 h-6 rounded-full border-2 border-outline/30 appearance-none cursor-pointer checked:bg-primary checked:border-primary transition-all peer"
        />
        <Check className="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
      </div>

      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="flex-1 bg-surface-container-low border-none rounded-lg px-3 py-1 text-on-surface focus:ring-1 focus:ring-primary/30 outline-none"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleUpdate()}
              onBlur={handleUpdate}
            />
          </div>
        ) : (
          <h3 className={`font-semibold text-on-surface truncate ${isCompleted ? 'line-through text-outline' : ''}`}>
            {task.title}
          </h3>
        )}

        <div className="flex items-center gap-4 mt-1">
          {task.due_date && (
            <>
              <div className={`flex items-center gap-1 text-[11px] font-bold ${isOverdue ? 'text-error' : 'text-outline'}`}>
                <Calendar className="w-3 h-3" />
                {formatDate(task.due_date)}
              </div>
              <div className={`flex items-center gap-1 text-[11px] font-bold ${isOverdue ? 'text-error' : 'text-outline'}`}>
                <Clock className="w-3 h-3" />
                {formatTime(task.due_date)}
                {isOverdue && <span className="uppercase ml-1 bg-error/10 px-1 rounded">Overdue</span>}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity md:opacity-100">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="p-2 text-outline hover:text-primary hover:bg-primary-container/30 rounded-lg transition-colors"
        >
          <Edit3 className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="p-2 text-outline hover:text-error hover:bg-error-container/30 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
