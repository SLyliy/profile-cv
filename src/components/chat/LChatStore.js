const LCHAT_STORAGE_KEY = "lchat_widget_state_v1";
const MAX_STORED_MESSAGES = 60;

function sanitizeMessage(message) {
  if (!message || typeof message !== "object") {
    return null;
  }

  const role = message.role === "user" ? "user" : message.role === "assistant" ? "assistant" : "";
  const content = typeof message.content === "string" ? message.content.trim() : "";
  if (!role || !content) {
    return null;
  }

  const createdAt =
    typeof message.createdAt === "string" && message.createdAt
      ? message.createdAt
      : new Date().toISOString();

  return {
    id: typeof message.id === "string" && message.id ? message.id : `${createdAt}-${Math.random()}`,
    role,
    content,
    createdAt,
  };
}

export function loadChatState() {
  if (typeof window === "undefined") {
    return { isOpen: false, suggestionsOpen: true, messages: [] };
  }

  try {
    const raw = window.localStorage.getItem(LCHAT_STORAGE_KEY);
    if (!raw) {
      return { isOpen: false, suggestionsOpen: true, messages: [] };
    }

    const parsed = JSON.parse(raw);
    const messages = Array.isArray(parsed?.messages)
      ? parsed.messages.map(sanitizeMessage).filter(Boolean).slice(-MAX_STORED_MESSAGES)
      : [];

    return {
      isOpen: Boolean(parsed?.isOpen),
      suggestionsOpen:
        typeof parsed?.suggestionsOpen === "boolean" ? parsed.suggestionsOpen : true,
      messages,
    };
  } catch {
    return { isOpen: false, suggestionsOpen: true, messages: [] };
  }
}

export function saveChatState(state) {
  if (typeof window === "undefined") {
    return;
  }

  const safeMessages = Array.isArray(state?.messages)
    ? state.messages.map(sanitizeMessage).filter(Boolean).slice(-MAX_STORED_MESSAGES)
    : [];

  const payload = {
    isOpen: Boolean(state?.isOpen),
    suggestionsOpen: Boolean(state?.suggestionsOpen),
    messages: safeMessages,
  };

  try {
    window.localStorage.setItem(LCHAT_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Ignore storage quota/permission errors.
  }
}

export function clearChatState() {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.removeItem(LCHAT_STORAGE_KEY);
  } catch {
    // Ignore storage errors.
  }
}

