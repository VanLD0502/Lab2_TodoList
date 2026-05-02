import React, { useState } from "react";
import { Plus, Calendar, Clock } from "lucide-react";

const QuickAdd = ({ onAdd }) => {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");

  const isValid = title.trim() !== "" && dueDate !== "" && dueTime !== "";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;
    
    // Kết hợp ngày và giờ: yyyy-MM-ddThh:mm
    const combinedDateTime = `${dueDate}T${dueTime}`;
    
    onAdd(title, combinedDateTime);
    setTitle("");
    setDueDate("");
    setDueTime("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-3xl p-6 shadow-sm border border-surface-container mb-8 space-y-4 animate-fade-in"
    >
      {/* Tầng 1: Tên Task */}
      <div className="w-full">
        <label className="block text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2 ml-1">
          Task Description
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task name..."
          className="w-full bg-surface-container-low border-2 border-transparent rounded-2xl px-5 py-3.5 text-on-surface placeholder:text-outline/40 focus:border-primary/20 focus:bg-white transition-all text-base font-medium outline-none"
        />
      </div>

      {/* Tầng 2: Ngày, Giờ và Nút Add (Chỉ hiện khi Valid) */}
      <div className="flex flex-col md:flex-row gap-4 items-end min-h-[85px]">
        <div className="flex-1 w-full">
          <label className="flex items-center gap-2 text-[10px] font-black text-outline uppercase tracking-[0.2em] mb-2 ml-1">
            <Calendar className="w-3 h-3" /> Date
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/10 transition-all outline-none cursor-pointer"
          />
        </div>

        <div className="flex-1 w-full">
          <label className="flex items-center gap-2 text-[10px] font-black text-outline uppercase tracking-[0.2em] mb-2 ml-1">
            <Clock className="w-3 h-3" /> Time (24h)
          </label>
          <input
            type="time"
            value={dueTime}
            onChange={(e) => setDueTime(e.target.value)}
            className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/10 transition-all outline-none cursor-pointer"
          />
        </div>

        <div className="w-full md:w-auto flex justify-end">
          {isValid ? (
            <button
              type="submit"
              className="w-full md:w-auto bg-primary text-white hover:bg-primary/90 px-8 py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-95 animate-fade-in"
            >
              <Plus className="w-5 h-5" />
              Add Task
            </button>
          ) : (
            <div className="h-[52px] flex items-center px-4 text-[10px] font-bold text-outline/40 uppercase tracking-widest italic">
              Fill all fields to add
            </div>
          )}
        </div>
      </div>
    </form>
  );
};

export default QuickAdd;
