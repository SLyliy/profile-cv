import { Resend } from "resend";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  buildUserReceiptEmail,
} from "./templates/userReceiptEmail.js";

const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX = 5;
const DEFAULT_FROM_EMAIL = "Portfolio Contact <onboarding@resend.dev>";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REQUIRED_ENV_KEYS = [
  "RESEND_API_KEY",
  "OWNER_EMAIL",
  "TURNSTILE_SECRET_KEY",
];

// Simple in-memory rate limit store (works for local dev / single instance)
const rateLimitStore = globalThis.__contactRateLimitStore || new Map();
globalThis.__contactRateLimitStore = rateLimitStore;
let localEnvCache = null;

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

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function normalizeTopic(topic) {
  const safeTopic = String(topic || "").trim();
  return safeTopic || "general";
}

function getSafeHttpUrl(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";

  try {
    const parsed = new URL(raw);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return "";
    }
    return parsed.toString();
  } catch {
    return "";
  }
}

function getResendErrorMessage(errorLike) {
  if (!errorLike) return "";
  if (typeof errorLike === "string") return errorLike;
  if (typeof errorLike.message === "string") return errorLike.message;
  if (Array.isArray(errorLike) && errorLike.length > 0) {
    return getResendErrorMessage(errorLike[0]);
  }
  try {
    return JSON.stringify(errorLike);
  } catch {
    return "Unknown Resend error";
  }
}

function parseDotEnv(content) {
  const parsed = {};
  const lines = content.split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const eqIndex = trimmed.indexOf("=");
    if (eqIndex <= 0) continue;

    const key = trimmed.slice(0, eqIndex).trim();
    let value = trimmed.slice(eqIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    parsed[key] = value;
  }

  return parsed;
}

function getLocalEnv() {
  if (localEnvCache) {
    return localEnvCache;
  }

  const cwd = globalThis.process?.cwd?.() || ".";
  const merged = {};
  const candidates = [".env", ".env.local"];

  for (const name of candidates) {
    const filePath = resolve(cwd, name);
    if (!existsSync(filePath)) continue;

    try {
      const content = readFileSync(filePath, "utf8");
      Object.assign(merged, parseDotEnv(content));
    } catch (error) {
      console.error(`Failed to read ${name}`, error);
    }
  }

  localEnvCache = merged;
  return merged;
}

function getEnv(key) {
  const processValue = globalThis.process?.env?.[key];
  if (processValue) return processValue;
  return getLocalEnv()[key];
}

function buildOwnerEmailHtml({ fullName, email, topic, message, subscribe, ip }) {
  return `
    <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.6;color:#1f2330;">
      <h2 style="margin-bottom:8px;">New Portfolio Contact Message</h2>
      <p style="margin:0 0 16px;">A user submitted the contact form.</p>
      <table style="border-collapse:collapse;width:100%;max-width:640px;">
        <tr><td style="padding:8px;border:1px solid #e5e7eb;"><strong>Full Name</strong></td><td style="padding:8px;border:1px solid #e5e7eb;">${escapeHtml(fullName)}</td></tr>
        <tr><td style="padding:8px;border:1px solid #e5e7eb;"><strong>Email</strong></td><td style="padding:8px;border:1px solid #e5e7eb;">${escapeHtml(email)}</td></tr>
        <tr><td style="padding:8px;border:1px solid #e5e7eb;"><strong>Topic</strong></td><td style="padding:8px;border:1px solid #e5e7eb;">${escapeHtml(topic)}</td></tr>
        <tr><td style="padding:8px;border:1px solid #e5e7eb;"><strong>Subscribe</strong></td><td style="padding:8px;border:1px solid #e5e7eb;">${subscribe ? "Yes" : "No"}</td></tr>
        <tr><td style="padding:8px;border:1px solid #e5e7eb;"><strong>IP</strong></td><td style="padding:8px;border:1px solid #e5e7eb;">${escapeHtml(ip)}</td></tr>
        <tr><td style="padding:8px;border:1px solid #e5e7eb;"><strong>Message</strong></td><td style="padding:8px;border:1px solid #e5e7eb;white-space:pre-wrap;">${escapeHtml(message)}</td></tr>
      </table>
      <p style="margin-top:16px;color:#6b7280;font-size:12px;">
        This email was sent by your portfolio contact form.
      </p>
    </div>
  `;
}

async function verifyTurnstileToken({ secret, token, ip }) {
  const body = new URLSearchParams();
  body.set("secret", secret);
  body.set("response", token);
  if (ip && ip !== "unknown") body.set("remoteip", ip);

  const resp = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    { method: "POST", body }
  );

  const data = await resp.json().catch(() => ({}));
  return data;
}

// ✅ IMPORTANT: must be async + must export default, otherwise Vercel may fail.
export default async function handler(req, res) {
  // Basic CORS for local dev (optional; safe)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return sendJson(res, 200, { ok: true });
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  const RESEND_API_KEY = getEnv("RESEND_API_KEY");
  const OWNER_EMAIL = getEnv("OWNER_EMAIL");
  const TURNSTILE_SECRET_KEY = getEnv("TURNSTILE_SECRET_KEY");
  const RESEND_FROM_EMAIL = getEnv("RESEND_FROM_EMAIL") || DEFAULT_FROM_EMAIL;
  const HEART_IMAGE_URL = getEnv("HEART_IMAGE_URL") || "https://res.cloudinary.com/dm6endo9v/image/upload/v1771651737/WechatIMG384_sviftz.png";
  const SITE_URL =
    getSafeHttpUrl(getEnv("SITE_URL") || getEnv("PORTFOLIO_SITE_URL")) ||
    getSafeHttpUrl(req.headers.origin) ||
    "https://example.com";

  const missingKeys = REQUIRED_ENV_KEYS.filter((key) => !getEnv(key));
  if (missingKeys.length > 0) {
    return sendJson(res, 500, {
      error: `Server environment is not configured: missing ${missingKeys.join(", ")}`,
    });
  }

  const ip = getClientIp(req);
  const rateLimit = checkRateLimit(ip);
  if (!rateLimit.allowed) {
    res.setHeader("Retry-After", String(rateLimit.retryAfter));
    return sendJson(res, 429, {
      error: "Too many requests. Please wait a minute and try again.",
    });
  }

  let payload = req.body;
  if (typeof payload === "string") {
    try {
      payload = JSON.parse(payload);
    } catch {
      return sendJson(res, 400, { error: "Invalid JSON body" });
    }
  }

  if (!payload || typeof payload !== "object") {
    return sendJson(res, 400, { error: "Invalid request body" });
  }

  const fullName = String(payload.fullName || "").trim();
  const email = String(payload.email || "").trim().toLowerCase();
  const topic = normalizeTopic(payload.topic);
  const message = String(payload.message || "").trim();
  const subscribe = Boolean(payload.subscribe);
  const turnstileToken = String(payload.turnstileToken || "").trim();

  if (!fullName || !email || !message) {
    return sendJson(res, 400, { error: "fullName, email and message are required" });
  }
  if (!EMAIL_REGEX.test(email)) {
    return sendJson(res, 400, { error: "Invalid email format" });
  }
  if (message.length > 2000) {
    return sendJson(res, 400, { error: "message must be 2000 characters or fewer" });
  }
  if (!turnstileToken) {
    return sendJson(res, 400, { error: "Turnstile token is required" });
  }

  try {
    const turnstile = await verifyTurnstileToken({
      token: turnstileToken,
      ip,
      secret: TURNSTILE_SECRET_KEY,
    });

    if (!turnstile?.success) {
      return sendJson(res, 400, { error: "Turnstile verification failed" });
    }

    const resend = new Resend(RESEND_API_KEY);

    const ownerEmailHtml = buildOwnerEmailHtml({
      fullName,
      email,
      topic,
      message,
      subscribe,
      ip,
    });

    const { html: userReceiptHtml, text: userReceiptText, subject: userReceiptSubject } = buildUserReceiptEmail({
      userName: fullName,
      topic,
      message,
      portfolioUrl: SITE_URL,
      heartImageUrl: HEART_IMAGE_URL,
    });

    const [ownerResult, userResult] = await Promise.all([
      resend.emails.send({
        from: RESEND_FROM_EMAIL,
        to: OWNER_EMAIL,
        replyTo: email,
        subject: `[Portfolio] ${topic} - ${fullName}`,
        html: ownerEmailHtml,
      }),
      resend.emails.send({
        from: RESEND_FROM_EMAIL,
        to: email,
        subject: userReceiptSubject,
        html: userReceiptHtml,
        text: userReceiptText,
      }),
    ]);

    if (ownerResult?.error || userResult?.error) {
      console.error("Resend send error", { ownerResult, userResult });
      const ownerError = getResendErrorMessage(ownerResult?.error);
      const userError = getResendErrorMessage(userResult?.error);
      const detail = [ownerError && `owner: ${ownerError}`, userError && `user: ${userError}`]
        .filter(Boolean)
        .join(" | ");
      return sendJson(res, 500, {
        error: detail ? `Failed to send email: ${detail}` : "Failed to send email",
      });
    }

    return sendJson(res, 200, { ok: true });
  } catch (error) {
    console.error("contact function error", error);
    return sendJson(res, 500, { error: "Internal server error" });
  }
}
