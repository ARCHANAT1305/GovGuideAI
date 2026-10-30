import React, { useState, useEffect } from "react";
import { Volume2, Square, Loader2 } from "lucide-react";
import { speakText, stopSpeaking, isSpeechSupported } from "../utils/speechHelper";

export default function AudioReaderButton({
  text,
  lang = "en",
  label,
  className = "",
  variant = "pill", // 'pill' | 'icon-only'
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    setSupported(isSpeechSupported());
    return () => {
      // Stop speech when component unmounts
      stopSpeaking();
    };
  }, []);

  if (!supported || !text) return null;

  const handleToggle = (e) => {
    e.stopPropagation(); // prevent card click / accordion toggle

    if (isPlaying) {
      stopSpeaking();
      setIsPlaying(false);
    } else {
      speakText(text, lang, {
        onStart: () => setIsPlaying(true),
        onEnd: () => setIsPlaying(false),
        onError: () => setIsPlaying(false),
      });
    }
  };

  const defaultLabel = isPlaying
    ? lang === "ta"
      ? "நிறுத்து"
      : "Stop"
    : lang === "ta"
    ? "கேட்க"
    : "Listen";

  const displayLabel = label || defaultLabel;

  if (variant === "icon-only") {
    return (
      <button
        type="button"
        onClick={handleToggle}
        className={`audio-btn-icon-only ${isPlaying ? "playing" : ""} ${className}`}
        title={isPlaying ? "Stop audio" : "Listen to this description"}
        aria-label={displayLabel}
      >
        {isPlaying ? <Square size={14} className="stop-icon" /> : <Volume2 size={16} />}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`audio-pill-btn ${isPlaying ? "is-playing" : ""} ${className}`}
      title={isPlaying ? "Stop audio" : "Listen aloud"}
      aria-label={displayLabel}
    >
      {isPlaying ? (
        <>
          <Square size={13} className="audio-stop-icon" />
          <span className="audio-waves">
            <span className="wave-bar"></span>
            <span className="wave-bar"></span>
            <span className="wave-bar"></span>
          </span>
          <span className="audio-label">{displayLabel}</span>
        </>
      ) : (
        <>
          <Volume2 size={14} />
          <span className="audio-label">{displayLabel}</span>
        </>
      )}
    </button>
  );
}
