"use client";

/**
 * Speech helpers for HamZabaan AI.
 *
 * STT:
 * - Uses Web Speech API.
 * - Continuous recognition.
 * - Accumulates final transcript.
 * - Provides live interim transcript.
 * - Automatically restarts when Chrome ends recognition unexpectedly.
 *
 * TTS:
 * - Uses browser speechSynthesis.
 * - Waits for voices to become available.
 * - Selects the closest matching language voice.
 * - Calls onEnd reliably.
 */

export type SpeechErrorKind =
  | "unsupported"
  | "permission"
  | "network"
  | "generic";

export interface ListenerCallbacks {
  onTranscript: (finalText: string, interimText: string) => void;
  onError: (kind: SpeechErrorKind) => void;
  onEnd: () => void;
}

export interface SpeechListener {
  stop: () => void;
}

/* -------------------------------------------------------------------------- */
/* STT                                                                        */
/* -------------------------------------------------------------------------- */

function getRecognitionCtor(): any {
  if (typeof window === "undefined") return null;

  return (
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition ||
    null
  );
}

export function speechRecognitionSupported(): boolean {
  return Boolean(getRecognitionCtor());
}

export function startListening(
  locale: string,
  cb: ListenerCallbacks
): SpeechListener | null {
  const Ctor = getRecognitionCtor();

  if (!Ctor) {
    cb.onError("unsupported");
    return null;
  }

  let recognition: any = null;

  let finalText = "";
  let stopped = false;
  let ended = false;
  let restarting = false;

  const finish = () => {
    if (ended) return;

    ended = true;
    cb.onEnd();
  };

  const mapError = (error: string): SpeechErrorKind => {
    switch (error) {
      case "not-allowed":
      case "service-not-allowed":
        return "permission";

      case "network":
        return "network";

      default:
        return "generic";
    }
  };

  const createRecognition = () => {
    recognition = new Ctor();

    recognition.lang = locale;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      restarting = false;
    };

    recognition.onresult = (event: any) => {
      let interim = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        const result = event.results[i];

        const text =
          result?.[0]?.transcript?.trim() ?? "";

        if (!text) continue;

        if (result.isFinal) {
          finalText +=
            (finalText ? " " : "") + text;
        } else {
          interim += text;
        }
      }

      cb.onTranscript(
        finalText,
        interim.trim()
      );
    };

    recognition.onerror = (event: any) => {
      const error = event?.error as string;

      /*
       * These are normal Web Speech API lifecycle events.
       * Don't kill the whole explanation because Chrome briefly
       * stopped listening.
       */
      if (
        error === "no-speech" ||
        error === "aborted"
      ) {
        return;
      }

      stopped = true;

      cb.onError(mapError(error));
    };

    recognition.onend = () => {
      if (stopped) {
        finish();
        return;
      }

      /*
       * Chrome frequently ends recognition even when the user
       * hasn't finished speaking. Restart it.
       */
      if (restarting) return;

      restarting = true;

      window.setTimeout(() => {
        if (stopped || ended) return;

        try {
          recognition.start();
        } catch {
          /*
           * If Chrome says recognition is already running,
           * leave it alone.
           */
          restarting = false;
        }
      }, 150);
    };
  };

  try {
    createRecognition();
    recognition.start();
  } catch {
    cb.onError("generic");
    return null;
  }

  return {
    stop: () => {
      if (stopped) return;

      stopped = true;

      try {
        recognition?.stop();
      } catch {
        finish();
      }
    },
  };
}

/* -------------------------------------------------------------------------- */
/* TTS                                                                        */
/* -------------------------------------------------------------------------- */

export function speechSynthesisSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    "speechSynthesis" in window &&
    "SpeechSynthesisUtterance" in window
  );
}

/**
 * Wait until Chrome has populated speechSynthesis.getVoices().
 */
function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (!speechSynthesisSupported()) {
      resolve([]);
      return;
    }

    const synth = window.speechSynthesis;

    const existing = synth.getVoices();

    if (existing.length > 0) {
      resolve(existing);
      return;
    }

    let resolved = false;

    const finish = () => {
      if (resolved) return;

      resolved = true;

      synth.removeEventListener(
        "voiceschanged",
        finish
      );

      resolve(synth.getVoices());
    };

    synth.addEventListener(
      "voiceschanged",
      finish
    );

    /*
     * Some browsers don't fire voiceschanged reliably.
     * Give them a short window to populate voices.
     */
    window.setTimeout(finish, 1000);
  });
}

function findBestVoice(
  voices: SpeechSynthesisVoice[],
  locale: string
): SpeechSynthesisVoice | undefined {
  if (!voices.length) return undefined;

  const normalized = locale.toLowerCase();

  const languageOnly =
    normalized.split("-")[0];

  /*
   * 1. Exact locale.
   */
  const exact = voices.find(
    (voice) =>
      voice.lang.toLowerCase() === normalized
  );

  if (exact) return exact;

  /*
   * 2. Same language.
   */
  const sameLanguage = voices.find(
    (voice) =>
      voice.lang
        .toLowerCase()
        .startsWith(languageOnly)
  );

  if (sameLanguage) return sameLanguage;

  return undefined;
}

export async function speakText(
  text: string,
  locale: string,
  onEnd?: () => void
): Promise<void> {
  if (
    !speechSynthesisSupported() ||
    !text.trim()
  ) {
    onEnd?.();
    return;
  }

  const synth = window.speechSynthesis;

  /*
   * Stop anything currently speaking.
   */
  synth.cancel();

  /*
   * Chrome may not have voices loaded immediately.
   */
  const voices = await loadVoices();

  /*
   * The async wait above means the user could have
   * navigated away / cancelled speech.
   */
  const utterance =
    new SpeechSynthesisUtterance(text);

  utterance.lang = locale;
  utterance.rate = 0.92;
  utterance.pitch = 1;

  const voice = findBestVoice(
    voices,
    locale
  );

  if (voice) {
    utterance.voice = voice;
  }

  let finished = false;

  const finish = () => {
    if (finished) return;

    finished = true;
    onEnd?.();
  };

  utterance.onend = finish;
  utterance.onerror = finish;

  /*
   * Chrome sometimes pauses speechSynthesis.
   * Calling resume() before speak helps prevent
   * silent/stuck utterances.
   */
  try {
    synth.resume();
    synth.speak(utterance);
  } catch {
    finish();
  }
}

export function stopSpeaking(): void {
  if (speechSynthesisSupported()) {
    window.speechSynthesis.cancel();
    window.speechSynthesis.resume();
  }
}