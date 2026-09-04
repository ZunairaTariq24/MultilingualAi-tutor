// /**
//  * Grok (xAI) integration — the ONLY place in the app that talks to the AI.
//  *
//  * Server-side only: reads XAI_API_KEY / XAI_MODEL from the environment.
//  * One chat-completions call per invocation, no retries (429 and timeouts are
//  * surfaced as typed errors so the API route can fail fast and safely).
//  */

// const XAI_URL = "https://api.x.ai/v1/chat/completions";
// const TIMEOUT_MS = 40_000;

// export type GrokErrorCode =
//   | "missing_key"
//   | "auth"
//   | "forbidden"
//   | "rate_limited"
//   | "server"
//   | "timeout"
//   | "network"
//   | "bad_response";

// export class GrokError extends Error {
//   code: GrokErrorCode;
//   constructor(code: GrokErrorCode, message: string) {
//     super(message);
//     this.name = "GrokError";
//     this.code = code;
//   }
// }

// export function hasGrokKey(): boolean {
//   return Boolean(process.env.XAI_API_KEY);
// }

// export interface GrokMessage {
//   role: "system" | "user" | "assistant";
//   content: string;
// }

// /**
//  * Single Grok chat request. Throws GrokError — never retries.
//  */
// export async function grokChat(
//   messages: GrokMessage[],
//   options?: { temperature?: number; maxTokens?: number }
// ): Promise<string> {
//   const apiKey = process.env.XAI_API_KEY;
//   if (!apiKey) throw new GrokError("missing_key", "XAI_API_KEY is not configured");

//   const model = process.env.XAI_MODEL || "grok-3";

//   const controller = new AbortController();
//   const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

//   let res: Response;
//   try {
//     res = await fetch(XAI_URL, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${apiKey}`,
//       },
//       body: JSON.stringify({
//         model,
//         messages,
//         temperature: options?.temperature ?? 0.6,
//         max_tokens: options?.maxTokens ?? 1024,
//         stream: false,
//       }),
//       signal: controller.signal,
//     });
//   } catch (err) {
//     if (err instanceof Error && err.name === "AbortError") {
//       throw new GrokError("timeout", "Grok request timed out");
//     }
//     throw new GrokError("network", "Could not reach the Grok API");
//   } finally {
//     clearTimeout(timer);
//   }

//   if (!res.ok) {
//   const errorBody = await res.text();

//   console.error("[GROK DEBUG]", {
//     status: res.status,
//     statusText: res.statusText,
//     body: errorBody.slice(0, 1000),
//   });

//   if (res.status === 401) {
//     throw new GrokError("auth", "Grok API key was rejected (401)");
//   }

//   if (res.status === 403) {
//     throw new GrokError("forbidden", "Grok API access forbidden (403)");
//   }

//   if (res.status === 429) {
//     throw new GrokError("rate_limited", "Grok API rate limit reached (429)");
//   }

//   throw new GrokError("server", `Grok API error (${res.status})`);
// }
//   let data: unknown;
//   try {
//     data = await res.json();
//   } catch {
//     throw new GrokError("bad_response", "Grok returned a non-JSON response");
//   }

//   const text = (data as { choices?: { message?: { content?: string } }[] })?.choices?.[0]?.message
//     ?.content;
//   if (typeof text !== "string" || !text.trim()) {
//     throw new GrokError("bad_response", "Grok returned an empty response");
//   }
//   return text.trim();
// }

/**
 * Tolerant JSON extraction for model output: direct parse, fenced ```json
 * blocks, or the first {...} span.
 */
// export function parseModelJson<T>(raw: string): T | null {
//   const attempts: string[] = [raw.trim()];

//   const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
//   if (fenced?.[1]) attempts.push(fenced[1].trim());

//   const first = raw.indexOf("{");
//   const last = raw.lastIndexOf("}");
//   if (first !== -1 && last > first) attempts.push(raw.slice(first, last + 1));

//   for (const candidate of attempts) {
//     try {
//       return JSON.parse(candidate) as T;
//     } catch {
//       /* try next candidate */
//     }
//   }
//   return null;
// }
/**
 * Groq integration — server-side only.
 * Keeps the existing grokChat() interface so the rest of HamZabaan
 * does not need to change.
 */

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const TIMEOUT_MS = 40_000;

export type GrokErrorCode =
  | "missing_key"
  | "auth"
  | "forbidden"
  | "rate_limited"
  | "server"
  | "timeout"
  | "network"
  | "bad_response";

export class GrokError extends Error {
  code: GrokErrorCode;

  constructor(code: GrokErrorCode, message: string) {
    super(message);
    this.name = "GrokError";
    this.code = code;
  }
}

export function hasGrokKey(): boolean {
  return Boolean(process.env.GROQ_API_KEY);
}

export interface GrokMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function grokChat(
  messages: GrokMessage[],
  options?: { temperature?: number; maxTokens?: number }
): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new GrokError(
      "missing_key",
      "GROQ_API_KEY is not configured"
    );
  }

  const model =
    process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let res: Response;

  try {
    res = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey.trim()}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: options?.temperature ?? 0.6,
        max_tokens: options?.maxTokens ?? 1024,
        stream: false,
      }),
      signal: controller.signal,
    });
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new GrokError("timeout", "Groq request timed out");
    }

    throw new GrokError(
      "network",
      "Could not reach the Groq API"
    );
  } finally {
    clearTimeout(timer);
  }

  if (!res.ok) {
    const errorBody = await res.text();

    console.error("[GROQ DEBUG]", {
      status: res.status,
      statusText: res.statusText,
      body: errorBody.slice(0, 1000),
    });

    if (res.status === 401) {
      throw new GrokError(
        "auth",
        "Groq API key was rejected (401)"
      );
    }

    if (res.status === 403) {
      throw new GrokError(
        "forbidden",
        "Groq API access forbidden (403)"
      );
    }

    if (res.status === 429) {
      throw new GrokError(
        "rate_limited",
        "Groq API rate limit reached (429)"
      );
    }

    throw new GrokError(
      "server",
      `Groq API error (${res.status})`
    );
  }

  let data: unknown;

  try {
    data = await res.json();
  } catch {
    throw new GrokError(
      "bad_response",
      "Groq returned a non-JSON response"
    );
  }

  const text = (
    data as {
      choices?: {
        message?: {
          content?: string;
        };
      }[];
    }
  )?.choices?.[0]?.message?.content;

  if (typeof text !== "string" || !text.trim()) {
    throw new GrokError(
      "bad_response",
      "Groq returned an empty response"
    );
  }

  return text.trim();
}

export function parseModelJson<T>(raw: string): T | null {
  const attempts: string[] = [raw.trim()];

  const fenced = raw.match(
    /```(?:json)?\s*([\s\S]*?)```/i
  );

  if (fenced?.[1]) {
    attempts.push(fenced[1].trim());
  }

  const first = raw.indexOf("{");
  const last = raw.lastIndexOf("}");

  if (first !== -1 && last > first) {
    attempts.push(raw.slice(first, last + 1));
  }

  for (const candidate of attempts) {
    try {
      return JSON.parse(candidate) as T;
    } catch {
      // Try next format
    }
  }

  return null;
}