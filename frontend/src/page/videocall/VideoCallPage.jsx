import React, { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

const VideoCallPage = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const jitsiRef = useRef(null);
  const apiRef   = useRef(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src   = "https://meet.jit.si/external_api.js";
    script.async = true;

    script.onload = () => {
      apiRef.current = new window.JitsiMeetExternalAPI("meet.jit.si", {
        roomName:    `medicare-appt-${appointmentId}`,
        parentNode:  jitsiRef.current,
        width:       "100%",
        height:      "100%",
        configOverwrite: {
          prejoinPageEnabled:    false,
          startWithAudioMuted:   false,
          startWithVideoMuted:   false,
        },
        interfaceConfigOverwrite: {
          TOOLBAR_BUTTONS: [
            "microphone", "camera", "hangup",
            "chat", "raisehand", "tileview", "fullscreen",
          ],
          SHOW_JITSI_WATERMARK: false,
        },
      });

      // Auto navigate back when call ends
      apiRef.current.addEventListener("readyToClose", () => {
        navigate(-1);
      });
    };

    document.body.appendChild(script);

    return () => {
      apiRef.current?.dispose();
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [appointmentId, navigate]);

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">

      {/* Header */}
      <div className="bg-gray-900 px-5 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-white font-bold text-sm">🏥 MediCare</span>
          <span className="text-gray-400 text-xs">|</span>
          <span className="text-gray-300 text-xs">Video Consultation</span>
          <span className="flex items-center gap-1 px-2 py-0.5 bg-green-500/20 text-green-400 text-xs font-semibold rounded-full border border-green-500/30">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            Live
          </span>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs font-semibold rounded-lg border border-red-500/30 transition"
        >
          ✕ Leave Call
        </button>
      </div>

      {/* Jitsi Container */}
      <div ref={jitsiRef} className="flex-1 w-full" />

    </div>
  );
};

export default VideoCallPage;