import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Video, Mic, MicOff, VideoOff, PhoneOff, Users, Clock } from "lucide-react";

const VideoCallPage = () => {
  const { appointmentId } = useParams();
  const navigate          = useNavigate();
  const jitsiRef          = useRef(null);
  const apiRef            = useRef(null);

  const [loading, setLoading]       = useState(true);
  const [callDuration, setDuration] = useState(0);

  // ⏱ Call timer
  useEffect(() => {
    if (loading) return;
    const timer = setInterval(() => setDuration((d) => d + 1), 1000);
    return () => clearInterval(timer);
  }, [loading]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // 🎥 Load Jitsi
  useEffect(() => {
    const script     = document.createElement("script");
    script.src       = "https://meet.jit.si/external_api.js";
    script.async     = true;

    script.onload = () => {
      apiRef.current = new window.JitsiMeetExternalAPI("meet.jit.si", {
        roomName:   `medicare-appt-${appointmentId}`,
        parentNode: jitsiRef.current,
        width:      "100%",
        height:     "100%",
        configOverwrite: {
          prejoinPageEnabled:  false,
          startWithAudioMuted: false,
          startWithVideoMuted: false,
          disableDeepLinking:  true,
        },
        interfaceConfigOverwrite: {
          TOOLBAR_BUTTONS: [
            "microphone", "camera", "hangup",
            "chat", "raisehand", "tileview", "fullscreen",
          ],
          SHOW_JITSI_WATERMARK:    false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          SHOW_BRAND_WATERMARK:    false,
          DEFAULT_BACKGROUND:      "#0f172a",
        },
      });

      // Hide loading once Jitsi is ready
      apiRef.current.addEventListener("videoConferenceJoined", () => {
        setLoading(false);
      });

      // Navigate back when call ends
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
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: "#0a0f1e" }}>

      {/* ===== TOP HEADER ===== */}
      <div
        className="flex items-center justify-between px-6 py-3 flex-shrink-0 border-b border-white/10"
        style={{ background: "linear-gradient(90deg, #0f172a 0%, #1e293b 100%)" }}
      >
        {/* Left — Brand */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/40">
              <span className="text-white text-sm">🏥</span>
            </div>
            <span className="text-white font-bold text-sm tracking-wide">
              Medi<span className="text-blue-400">Care</span>
            </span>
          </div>

          <div className="h-4 w-px bg-white/20" />

          <span className="text-slate-400 text-xs">Video Consultation</span>

          {/* Live badge */}
          <span className="flex items-center gap-1.5 px-2.5 py-1 bg-green-500/15 text-green-400 text-xs font-semibold rounded-full border border-green-500/25">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            LIVE
          </span>
        </div>

        {/* Center — Timer */}
        {!loading && (
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-1.5 bg-white/5 rounded-full border border-white/10">
            <Clock size={13} className="text-blue-400" />
            <span className="text-white font-mono text-sm font-semibold">
              {formatTime(callDuration)}
            </span>
          </div>
        )}

        {/* Right — Actions */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
            <Users size={13} className="text-slate-400" />
            <span className="text-slate-300 text-xs font-medium">Consultation Room</span>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-red-500/30 transition-all hover:scale-105 active:scale-95"
          >
            <PhoneOff size={14} />
            Leave Call
          </button>
        </div>
      </div>

      {/* ===== LOADING SCREEN ===== */}
      {loading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-6"
          style={{ background: "linear-gradient(135deg, #0a0f1e 0%, #0f172a 50%, #0a1628 100%)" }}
        >
          {/* Animated rings */}
          <div className="relative flex items-center justify-center">
            <div className="absolute w-32 h-32 rounded-full border border-blue-500/20 animate-ping" />
            <div className="absolute w-24 h-24 rounded-full border border-blue-500/30 animate-ping" style={{ animationDelay: "0.2s" }} />
            <div className="absolute w-16 h-16 rounded-full border border-blue-500/40 animate-ping" style={{ animationDelay: "0.4s" }} />
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-2xl shadow-blue-600/50">
              <Video size={36} className="text-white" />
            </div>
          </div>

          <div className="text-center space-y-2">
            <h2 className="text-white text-xl font-bold">Connecting to consultation...</h2>
            <p className="text-slate-400 text-sm">Setting up your secure video room</p>
          </div>

          {/* Loading dots */}
          <div className="flex items-center gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>

          {/* Info pills */}
          <div className="flex items-center gap-3 mt-4">
            {["🔒 Encrypted", "🎥 HD Video", "🎙️ Clear Audio"].map((item) => (
              <span
                key={item}
                className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-slate-400 text-xs"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ===== JITSI CONTAINER ===== */}
      <div ref={jitsiRef} className="flex-1 w-full" />

      {/* ===== BOTTOM INFO BAR ===== */}
      {!loading && (
        <div
          className="flex items-center justify-center gap-6 px-6 py-2 flex-shrink-0 border-t border-white/10"
          style={{ background: "linear-gradient(90deg, #0f172a 0%, #1e293b 100%)" }}
        >
          {[
            { icon: "🔒", label: "End-to-End Encrypted" },
            { icon: "🏥", label: "MediCare Secure Call" },
            { icon: "🎥", label: "HD Quality" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <span className="text-xs">{item.icon}</span>
              <span className="text-slate-500 text-xs">{item.label}</span>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default VideoCallPage;