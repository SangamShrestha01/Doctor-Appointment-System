import React from "react";
import { Video } from "lucide-react";
import { useNavigate } from "react-router-dom";

const VideoCallButton = ({ appointmentId, role }) => {
  const navigate = useNavigate();
  const isDoctor = role === "doctor";

  return (
    <button
      onClick={() => navigate(`/video-call/${appointmentId}`)}
      className={`
        inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-medium
        transition-all duration-150 active:scale-[0.97] cursor-pointer border-none outline-none
        ${isDoctor
          ? "bg-blue-700 hover:bg-blue-800 text-blue-50"
          : "bg-teal-700 hover:bg-teal-800 text-teal-50"
        }
      `}
    >
      <span
        className={`
          flex items-center justify-center w-7 h-7 rounded-lg bg-white/20 shrink-0
        `}
      >
        <Video size={14} />
      </span>

      <span className="flex flex-col items-start gap-px leading-tight">
        <span className="text-sm font-medium">
          {isDoctor ? "Start video call" : "Join video call"}
        </span>
        <span className="text-[11px] font-normal opacity-65">
          {isDoctor ? "You'll be the host" : "Doctor is waiting"}
        </span>
      </span>
    </button>
  );
};

export default VideoCallButton;