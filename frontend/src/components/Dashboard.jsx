import React, { useState, useEffect, useCallback } from "react";
import api from "../services/api";
import Header from "./Header";
import QuickAdd from "./QuickAdd";
import SearchFilters from "./SearchFilters";
import StatsCards from "./StatsCards";
import TaskList from "./TaskList";
import Pagination from "./Pagination";
import { Loader2 } from "lucide-react";

const TASKS_PER_PAGE = 5;

export default function Dashboard({ user, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchTasks = useCallback(async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleAddTask = async (title, combinedDateTime) => {
    try {
      const res = await api.post("/tasks", { title, due_date: combinedDateTime });
      setTasks((prev) => [res.data, ...prev]);
    } catch (err) {
      console.error("Failed to add task:", err);
    }
  };

  const handleToggle = async (taskId, completed) => {
    try {
      await api.put(`/tasks/${taskId}`, { completed });
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, completed } : t))
      );
    } catch (err) {
      console.error("Failed to toggle task:", err);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  const handleUpdate = async (taskId, updateData) => {
    try {
      await api.put(`/tasks/${taskId}`, updateData);
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, ...updateData } : t))
      );
    } catch (err) {
      console.error("Failed to update task:", err);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (search && !task.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter === "completed" && !task.completed) return false;
    if (statusFilter === "pending" && task.completed) return false;

    if (dateFilter !== "all" && task.due_date) {
      const now = new Date();
      const dueDate = new Date(task.due_date);
      
      if (dateFilter === "today") {
        if (dueDate.toDateString() !== now.toDateString()) return false;
      } else if (dateFilter === "week") {
        const weekFromNow = new Date(now);
        weekFromNow.setDate(now.getDate() + 7);
        if (dueDate < now || dueDate > weekFromNow) return false;
      } else if (dateFilter === "overdue") {
        // So sánh chính xác từng phút
        if (task.completed || dueDate >= now) return false;
      }
    }
    return true;
  });

  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.filter((t) => !t.completed).length;

  const totalPages = Math.ceil(filteredTasks.length / TASKS_PER_PAGE);
  const paginatedTasks = filteredTasks.slice(
    (currentPage - 1) * TASKS_PER_PAGE,
    currentPage * TASKS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, dateFilter, statusFilter]);

  return (
    <div className="min-h-screen bg-background font-body pb-20 overflow-x-hidden">
      <Header user={user} onLogout={onLogout} />

      <main className="max-w-4xl mx-auto px-6 mt-8 flex flex-col items-stretch">
        <QuickAdd onAdd={handleAddTask} />

        <SearchFilters
          search={search}
          setSearch={setSearch}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        <StatsCards completedCount={completedCount} pendingCount={pendingCount} />

        <div className="w-full min-h-[300px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-primary">
              <Loader2 className="w-10 h-10 animate-spin" />
              <p className="mt-4 font-medium text-outline">Loading tasks...</p>
            </div>
          ) : (
            <>
              <TaskList
                tasks={paginatedTasks}
                onToggle={handleToggle}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
              />

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </div>
      </main>

      <footer className="text-center py-10 opacity-20 mt-auto">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-outline">
          Master To Do • Lab 2 Computational Thinking
        </p>
      </footer>
    </div>
  );
}
