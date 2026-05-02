import React from "react";
import TaskCard from "./TaskCard";
import { ClipboardList } from "lucide-react";

const TaskList = ({ tasks, onToggle, onDelete, onUpdate }) => {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-outline/40">
        <ClipboardList className="w-20 h-20 mb-4 stroke-[1px]" />
        <p className="text-lg font-medium">Chưa có task nào. Hãy thêm task đầu tiên!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
};

export default TaskList;
