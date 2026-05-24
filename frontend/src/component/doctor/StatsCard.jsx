import React from "react";

const StatsCard = ({ title, value, color, bg, icon, subtitle }) => {
  return (
    <div className={`relative overflow-hidden rounded-2xl p-5 border border-white shadow-sm flex items-center gap-4 ${bg}`}>
      {/* Icon */}
      <div className="w-12 h-12 rounded-xl bg-white/60 flex items-center justify-center text-2xl flex-shrink-0 shadow-sm">
        {icon}
      </div>
      {/* Text */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</p>
        <p className={`text-3xl font-bold mt-0.5 ${color}`}>{value}</p>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
      {/* Decorative circle */}
      <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full bg-white/20" />
    </div>
  );
};

export default StatsCard;