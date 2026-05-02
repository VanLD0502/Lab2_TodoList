import React from "react";
import { Search } from "lucide-react";

const SearchFilters = ({
  search,
  setSearch,
  dateFilter,
  setDateFilter,
  statusFilter,
  setStatusFilter,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline/60" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tasks..."
          className="w-full bg-surface-container-low border border-surface-container rounded-xl pl-12 pr-4 py-2.5 text-on-surface focus:ring-2 focus:ring-primary/20 transition-all"
        />
      </div>

      <div className="flex gap-2">
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="bg-surface-container-low border border-surface-container rounded-xl px-4 py-2.5 text-sm font-medium text-on-surface focus:ring-2 focus:ring-primary/20 transition-all outline-none"
        >
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="overdue">Overdue</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-surface-container-low border border-surface-container rounded-xl px-4 py-2.5 text-sm font-medium text-on-surface focus:ring-2 focus:ring-primary/20 transition-all outline-none"
        >
          <option value="all">All Progress</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </div>
    </div>
  );
};

export default SearchFilters;
