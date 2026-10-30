// Web Speech API Helper for Bilingual Voice Readout (English & Tamil)

let voices = [];

function loadVoices() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return;
  }
  voices = window.speechSynthesis.getVoices() || [];
}

if (typeof window !== "undefined" && "speechSynthesis" in window) {
  loadVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }
}

export function isSpeechSupported() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function stopSpeaking() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Strips markdown symbols, URLs, and noisy punctuation for clean speech synthesis
 */
function cleanTextForSpeech(text) {
  if (!text) return "";
  return text
    .replace(/https?:\/\/\S+/g, "") // remove URLs
    .replace(/[*_#`~[\]()]/g, " ") // remove markdown characters
    .replace(/[₹]/g, " Rupees ") // pronounce rupee symbol
    .replace(/[•✓✗]/g, "") // remove icons/bullets
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Speaks text using the browser's speech synthesis engine
 * @param {string} text - text to read
 * @param {string} lang - 'en' or 'ta'
 * @param {object} callbacks - { onStart, onEnd, onError }
 */
export function speakText(text, lang = "en", callbacks = {}) {
  if (!isSpeechSupported()) {
    callbacks.onError?.("Speech synthesis not supported on this browser.");
    return;
  }

  // Cancel any ongoing speech first
  stopSpeaking();

  const cleaned = cleanTextForSpeech(text);
  if (!cleaned) {
    callbacks.onEnd?.();
    return;
  }

  // Reload voices if empty
  if (voices.length === 0) {
    loadVoices();
  }

  const utterance = new SpeechSynthesisUtterance(cleaned);

  if (lang === "ta") {
    // Look for Tamil voice
    const tamilVoice = voices.find(
      (v) =>
        v.lang.toLowerCase().startsWith("ta") ||
        v.name.toLowerCase().includes("tamil")
    );
    if (tamilVoice) {
      utterance.voice = tamilVoice;
      utterance.lang = tamilVoice.lang;
    } else {
      utterance.lang = "ta-IN";
    }
    utterance.rate = 0.9; // Slightly slower for clear Tamil pronunciation
  } else {
    // English (prefer Indian English if present, fallback to default English)
    const indianVoice = voices.find(
      (v) =>
        v.lang === "en-IN" ||
        v.lang.toLowerCase().includes("en-in") ||
        v.name.toLowerCase().includes("india")
    );
    const englishVoice =
      indianVoice || voices.find((v) => v.lang.toLowerCase().startsWith("en"));
    if (englishVoice) {
      utterance.voice = englishVoice;
      utterance.lang = englishVoice.lang;
    } else {
      utterance.lang = "en-IN";
    }
    utterance.rate = 0.95;
  }

  utterance.pitch = 1.0;

  utterance.onstart = () => {
    callbacks.onStart?.();
  };

  utterance.onend = () => {
    callbacks.onEnd?.();
  };

  utterance.onerror = (e) => {
    // Ignored if cancelled intentionally
    if (e.error !== "canceled" && e.error !== "interrupted") {
      callbacks.onError?.(e);
    }
    callbacks.onEnd?.();
  };

  window.speechSynthesis.speak(utterance);
}
