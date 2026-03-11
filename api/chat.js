const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX = 20;
const DEFAULT_MODEL = "deepseek-chat";

const SYSTEM_PROMPT = `You are Little L, a warm, calm, concise assistant for portfolio visitors.
Tone: friendly, gentle, professional, short sentences.
Encourage collaboration, UI feedback, and internship conversations.
Never claim personal experiences.
Do not collect sensitive personal data.
If users ask for contact details, direct them to the Contact page.`;

function buildSystemPrompt(locale) {
  if (locale === "zh") {
    return `${SYSTEM_PROMPT}
Reply in Simplified Chinese.
Keep proper nouns, company names, product names, and technical terms in their original language.`;
  }

  return `${SYSTEM_PROMPT}
Reply in English unless the user clearly prefers another language.`;
}

const rateLimitStore = globalThis.__lChatRateLimitStore || new Map();
globalThis.__lChatRateLimitStore = rateLimitStore;

function sendJson(res, status, payload) {
  res.status(status).json(payload);
}

function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.trim()) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = req.headers["x-real-ip"];
  if (typeof realIp === "string" && realIp.trim()) {
    return realIp.trim();
  }
  return req.socket?.remoteAddress || "unknown";
}

function checkRateLimit(ip) {
  const now = Date.now();
  const existing = rateLimitStore.get(ip);

  if (!existing || now - existing.startTime > RATE_LIMIT_WINDOW_MS) {
    rateLimitStore.set(ip, { count: 1, startTime: now });
    return { allowed: true };
  }

  if (existing.count >= RATE_LIMIT_MAX) {
    const retryAfter = Math.ceil(
      (RATE_LIMIT_WINDOW_MS - (now - existing.startTime)) / 1000
    );
    return { allowed: false, retryAfter };
  }

  existing.count += 1;
  rateLimitStore.set(ip, existing);
  return { allowed: true };
}

function normalizeMessage(message) {
  if (!message || typeof message !== "object") {
    return null;
  }

  const role = message.role === "user" ? "user" : message.role === "assistant" ? "assistant" : "";
  const content = typeof message.content === "string" ? message.content.trim() : "";

  if (!role || !content) {
    return null;
  }

  return { role, content };
}

function getSafeBaseUrl(rawUrl) {
  const value = String(rawUrl || "").trim();
  if (!value) return "";
  return value.replace(/\/+$/, "");
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return sendJson(res, 200, { ok: true });
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    return sendJson(res, 405, { ok: false, error: "Method not allowed" });
  }

  const MKEAI_API_KEY = globalThis.process?.env?.MKEAI_API_KEY;
  const MKEAI_BASE_URL = getSafeBaseUrl(globalThis.process?.env?.MKEAI_BASE_URL);
  const MKEAI_MODEL = globalThis.process?.env?.MKEAI_MODEL || DEFAULT_MODEL;

  if (!MKEAI_API_KEY || !MKEAI_BASE_URL) {
    return sendJson(res, 500, {
      ok: false,
      error: "Server environment is missing MKEAI_API_KEY or MKEAI_BASE_URL.",
    });
  }

  const ip = getClientIp(req);
  const rateLimit = checkRateLimit(ip);
  if (!rateLimit.allowed) {
    res.setHeader("Retry-After", String(rateLimit.retryAfter));
    return sendJson(res, 429, {
      ok: false,
      error: "Too many requests. Please wait and try again.",
    });
  }

  let payload = req.body;
  if (typeof payload === "string") {
    try {
      payload = JSON.parse(payload);
    } catch {
      return sendJson(res, 400, { ok: false, error: "Invalid JSON body." });
    }
  }

  if (!payload || typeof payload !== "object") {
    return sendJson(res, 400, { ok: false, error: "Invalid request body." });
  }

  const locale = payload.locale === "zh" ? "zh" : "en";

  if (!Array.isArray(payload.messages)) {
    return sendJson(res, 400, { ok: false, error: "messages must be an array." });
  }

  const cleanMessages = payload.messages
    .map(normalizeMessage)
    .filter(Boolean)
    .slice(-30);

  const userMessageFallback =
    typeof payload.userMessage === "string" ? payload.userMessage.trim() : "";
  const lastUserMessage =
    [...cleanMessages].reverse().find((item) => item.role === "user")?.content ||
    userMessageFallback;

  if (!lastUserMessage) {
    return sendJson(res, 400, {
      ok: false,
      error: "A user message is required.",
    });
  }

  if (lastUserMessage.length > 2000) {
    return sendJson(res, 400, {
      ok: false,
      error: "Last user message must be 2000 characters or fewer.",
    });
  }

  const requestMessages = [
    { role: "system", content: buildSystemPrompt(locale) },
    ...cleanMessages,
  ];

  try {
    const upstreamResponse = await fetch(`${MKEAI_BASE_URL}/v1/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${MKEAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MKEAI_MODEL,
        messages: requestMessages,
        temperature: 0.7,
      }),
    });

    const upstreamPayload = await upstreamResponse.json().catch(() => ({}));
    if (!upstreamResponse.ok) {
      const upstreamError =
        upstreamPayload?.error?.message ||
        upstreamPayload?.message ||
        `Upstream request failed (${upstreamResponse.status}).`;
      const mappedStatus = upstreamResponse.status === 429 ? 429 : 502;
      return sendJson(res, mappedStatus, {
        ok: false,
        error: upstreamError,
      });
    }

    const assistantContent = String(
      upstreamPayload?.choices?.[0]?.message?.content || ""
    ).trim();

    if (!assistantContent) {
      return sendJson(res, 502, {
        ok: false,
        error: "AI response was empty.",
      });
    }

    return sendJson(res, 200, {
      ok: true,
      assistant: {
        role: "assistant",
        content: assistantContent,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : "Failed to reach AI service.";
    return sendJson(res, 502, {
      ok: false,
      error: message,
    });
  }
}
