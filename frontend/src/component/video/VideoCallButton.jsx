import React from "react";
import { Video } from "lucide-react";
import { useNavigate } from "react-router-dom";

const VideoCallButton = ({ appointmentId, role }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/video-call/${appointmentId}`)}
      className={`
        inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition
        ${role === "doctor"
          ? "bg-blue-600 hover:bg-blue-700 text-white"
          : "bg-green-600 hover:bg-green-700 text-white"
        }
      `}
    >
      <Video size={16} />
      {role === "doctor" ? "Start Video Call" : "Join Video Call"}
    </button>
  );
};

export default VideoCallButton;