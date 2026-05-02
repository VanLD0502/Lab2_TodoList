import React from "react";
import { CheckCircle2, Clock } from "lucide-react";

const StatsCards = ({ completedCount, pendingCount }) => {
  return (
    <div className="grid grid-cols-2 gap-4 mb-8">
      <div className="bg-white p-5 rounded-2xl border border-surface-container flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
        <div className="w-12 h-12 rounded-xl bg-tertiary-container flex items-center justify-center">
          <CheckCircle2 className="w-6 h-6 text-on-tertiary-container" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-outline uppercase tracking-wider">Completed</p>
          <p className="text-2xl font-bold text-on-surface">{completedCount}</p>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-surface-container flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
        <div className="w-12 h-12 rounded-xl bg-secondary-container flex items-center justify-center">
          <Clock className="w-6 h-6 text-on-secondary-container" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-outline uppercase tracking-wider">In Progress</p>
          <p className="text-2xl font-bold text-on-surface">{pendingCount}</p>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;
