import React from "react";

const StatsCard = ({ title, value, color }) => {
  return (
    <div
      className={`rounded-xl p-5 shadow-sm border bg-white flex flex-col gap-2`}
    >
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>

      <p className={`text-2xl font-bold ${color}`}>
        {value}
      </p>
    </div>
  );
};

export default StatsCard;