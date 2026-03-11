import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { clearChatState, loadChatState, saveChatState } from "./LChatStore";
import "./LChatWidget.css";
import { useLanguage } from "../../i18n/language-context";

const MAX_INPUT_CHARS = 2000;
const MAX_TEXTAREA_ROWS = 5;

const SUGGESTION_CHIPS = [
  {
    en: "UI feedback",
    zh: "UI 反馈",
  },
  {
    en: "Collaboration",
    zh: "合作",
  },
  {
    en: "Internship",
    zh: "实习",
  },
  {
    en: "Project idea",
    zh: "项目想法",
  },
  {
    en: "Say hi",
    zh: "打个招呼",
  },
  {
    en: "Ask a question",
    zh: "提个问题",
  },
];

const CHAT_COPY = {
  en: {
    openChat: "Open chat with L",
    closeChat: "Close chat with L",
    dialogLabel: "Chat with L",
    title: "Chat with L",
    subtitle: "Ask anything - I'll reply here.",
    clear: "Clear",
    minimize: "Minimize chat",
    retry: "Retry",
    emptyMessage:
      "Hi, I am L. Ask about projects, UI feedback, collaboration, or internship availability.",
    hideSuggestions: "Hide suggestions",
    showSuggestions: "Show suggestions",
    placeholder: "Write a message to L...",
    send: "Send",
    sendMessageAria: "Send message",
    tooLong: (max) => `Message is too long. Max ${max} characters.`,
    unavailable: "L is temporarily unavailable. Please try again.",
    emptyResponse: "L returned an empty response.",
    requestFailed: "Request failed.",
    retryFailed: "Retry failed.",
  },
  zh: {
    openChat: "打开与 L 的聊天",
    closeChat: "关闭与 L 的聊天",
    dialogLabel: "与 L 聊天",
    title: "与 L 聊天",
    subtitle: "随便问，我会在这里回复。",
    clear: "清空",
    minimize: "收起聊天",
    retry: "重试",
    emptyMessage: "你好，我是 L。你可以问我项目、UI 反馈、合作或实习相关问题。",
    hideSuggestions: "隐藏建议",
    showSuggestions: "显示建议",
    placeholder: "给 L 留条消息...",
    send: "发送",
    sendMessageAria: "发送消息",
    tooLong: (max) => `消息过长，最多 ${max} 个字符。`,
    unavailable: "L 暂时不可用，请稍后再试。",
    emptyResponse: "L 返回了空内容。",
    requestFailed: "请求失败。",
    retryFailed: "重试失败。",
  },
};

function localizeChatError(message, copy, language) {
  const text = String(message || "").trim();
  if (!text) {
    return copy.requestFailed;
  }

  if (language !== "zh") {
    return text;
  }

  const normalized = text.toLowerCase();

  if (normalized.includes("temporarily unavailable") || normalized.includes("too many requests")) {
    return copy.unavailable;
  }
  if (normalized.includes("empty response")) {
    return copy.emptyResponse;
  }
  if (normalized.includes("retry failed")) {
    return copy.retryFailed;
  }

  return copy.requestFailed;
}

function createMessage(role, content) {
  const createdAt = new Date().toISOString();
  return {
    id: `${createdAt}-${Math.random().toString(16).slice(2, 10)}`,
    role,
    content,
    createdAt,
  };
}

function formatClock(isoString) {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M20 11.8c0 4.1-3.7 7.4-8.3 7.4-1 0-1.9-.2-2.8-.5L4 20l1.2-3.7c-1.1-1.2-1.8-2.8-1.8-4.5 0-4 3.7-7.3 8.3-7.3S20 7.8 20 11.8Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M8.8 11.9h.01M11.7 11.9h.01M14.6 11.9h.01" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function MinimizeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 12h12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m5 12 14-7-4.8 14-2.2-5.8L5 12Z" fill="currentColor" />
      <path d="M11.8 13.2 19 5.1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export default function LChatWidget() {
  const { language } = useLanguage();
  const copy = CHAT_COPY[language];
  const initialState = useMemo(() => loadChatState(), []);
  const [isOpen, setIsOpen] = useState(initialState.isOpen);
  const [suggestionsOpen, setSuggestionsOpen] = useState(initialState.suggestionsOpen);
  const [messages, setMessages] = useState(initialState.messages);
  const [draft, setDraft] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [retryPayloadMessages, setRetryPayloadMessages] = useState(null);

  const windowRef = useRef(null);
  const textareaRef = useRef(null);
  const messageListRef = useRef(null);

  useEffect(() => {
    saveChatState({
      isOpen,
      suggestionsOpen,
      messages,
    });
  }, [isOpen, suggestionsOpen, messages]);

  useEffect(() => {
    if (!isOpen) return;

    const timer = window.setTimeout(() => {
      textareaRef.current?.focus();
    }, 120);

    return () => window.clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    const list = messageListRef.current;
    if (!list) return;

    list.scrollTop = list.scrollHeight;
  }, [messages, isLoading, isOpen]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    const lineHeight = 22;
    const maxHeight = lineHeight * MAX_TEXTAREA_ROWS + 18;
    textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
  }, [draft]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const windowEl = windowRef.current;
      if (!windowEl) {
        return;
      }

      const activeElement = document.activeElement;
      if (!windowEl.contains(activeElement)) {
        return;
      }

      const focusables = Array.from(
        windowEl.querySelectorAll(
          "button, textarea, a[href], [tabindex]:not([tabindex='-1'])"
        )
      ).filter((node) => !node.disabled && node.offsetParent !== null);

      if (focusables.length === 0) {
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  const buildApiMessages = useCallback((list) => {
    return list
      .filter((item) => item.role === "user" || item.role === "assistant")
      .map((item) => ({
        role: item.role,
        content: item.content,
      }));
  }, []);

  const requestAssistant = useCallback(async (apiMessages, userMessage) => {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: apiMessages,
        userMessage,
        locale: language,
      }),
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok || !payload?.ok) {
      throw new Error(payload?.error || copy.unavailable);
    }

    const assistant = payload.assistant;
    if (!assistant || typeof assistant.content !== "string" || !assistant.content.trim()) {
      throw new Error(copy.emptyResponse);
    }

    return assistant.content.trim();
  }, [copy.emptyResponse, copy.unavailable, language]);

  const sendUserMessage = useCallback(
    async (text) => {
      const content = text.trim();
      if (!content || isLoading) {
        return;
      }

      if (content.length > MAX_INPUT_CHARS) {
        setError(copy.tooLong(MAX_INPUT_CHARS));
        return;
      }

      const userMessage = createMessage("user", content);
      const nextMessages = [...messages, userMessage];
      const payloadMessages = buildApiMessages(nextMessages);

      setMessages(nextMessages);
      setDraft("");
      setError("");
      setIsLoading(true);

      try {
        const assistantContent = await requestAssistant(payloadMessages, content);
        setMessages((prev) => [...prev, createMessage("assistant", assistantContent)]);
        setRetryPayloadMessages(null);
      } catch (err) {
        setError(
          localizeChatError(
            err instanceof Error ? err.message : copy.requestFailed,
            copy,
            language
          )
        );
        setRetryPayloadMessages(payloadMessages);
      } finally {
        setIsLoading(false);
      }
    },
    [buildApiMessages, copy, isLoading, language, messages, requestAssistant]
  );

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      await sendUserMessage(draft);
    },
    [draft, sendUserMessage]
  );

  const handleRetry = useCallback(async () => {
    if (!retryPayloadMessages || isLoading) {
      return;
    }

    const lastUser = [...retryPayloadMessages]
      .reverse()
      .find((item) => item.role === "user")?.content;

    setIsLoading(true);
    setError("");
    try {
      const assistantContent = await requestAssistant(retryPayloadMessages, lastUser || "");
      setMessages((prev) => [...prev, createMessage("assistant", assistantContent)]);
      setRetryPayloadMessages(null);
    } catch (err) {
      setError(
        localizeChatError(
          err instanceof Error ? err.message : copy.retryFailed,
          copy,
          language
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, [copy, isLoading, language, requestAssistant, retryPayloadMessages]);

  const handleClearChat = useCallback(() => {
    setMessages([]);
    setDraft("");
    setError("");
    setRetryPayloadMessages(null);
    setSuggestionsOpen(true);
    clearChatState();
  }, []);

  const onTextareaKeyDown = useCallback(
    (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        void sendUserMessage(draft);
      }
    },
    [draft, sendUserMessage]
  );

  const canSend = draft.trim().length > 0 && !isLoading;

  return (
    <div className="lchat-root">
      <button
        type="button"
        className={`lchat-bubble${isOpen ? " is-open" : ""}`}
        onClick={() => setIsOpen((value) => !value)}
        aria-label={isOpen ? copy.closeChat : copy.openChat}
      >
        <ChatIcon />
        <span className="lchat-bubble-label">L</span>
      </button>

      <section
        ref={windowRef}
        className={`lchat-window${isOpen ? " is-open" : ""}`}
        role="dialog"
        aria-label={copy.dialogLabel}
        aria-hidden={!isOpen}
      >
        <header className="lchat-header">
          <div className="lchat-header-copy">
            <h2>{copy.title}</h2>
            <p>{copy.subtitle}</p>
          </div>
          <div className="lchat-header-actions">
            <button type="button" className="lchat-header-btn" onClick={handleClearChat}>
              {copy.clear}
            </button>
            <button
              type="button"
              className="lchat-header-btn lchat-header-btn--icon"
              onClick={() => setIsOpen(false)}
              aria-label={copy.minimize}
            >
              <MinimizeIcon />
            </button>
          </div>
        </header>

        {error ? (
          <div className="lchat-error-banner" role="status" aria-live="polite">
            <span>{error}</span>
            <button
              type="button"
              onClick={handleRetry}
              disabled={!retryPayloadMessages || isLoading}
              className="lchat-retry-btn"
            >
              {copy.retry}
            </button>
          </div>
        ) : null}

        <div className="lchat-messages" ref={messageListRef}>
          {messages.length === 0 ? (
            <p className="lchat-empty-message">
              {copy.emptyMessage}
            </p>
          ) : null}

          {messages.map((message) => (
            <article
              key={message.id}
              className={`lchat-message-row ${
                message.role === "user" ? "lchat-message-row--user" : "lchat-message-row--assistant"
              }`}
            >
              <div className="lchat-message-bubble">{message.content}</div>
              <time className="lchat-message-time">{formatClock(message.createdAt)}</time>
            </article>
          ))}

          {isLoading ? (
            <article className="lchat-message-row lchat-message-row--assistant">
              <div className="lchat-message-bubble lchat-message-bubble--typing">
                <span />
                <span />
                <span />
              </div>
            </article>
          ) : null}
        </div>

        <div className="lchat-composer">
          <button
            type="button"
            className="lchat-suggestions-toggle"
            onClick={() => setSuggestionsOpen((value) => !value)}
          >
            {suggestionsOpen ? copy.hideSuggestions : copy.showSuggestions}
          </button>

          {suggestionsOpen ? (
            <div className="lchat-suggestions">
              {SUGGESTION_CHIPS.map((chip) => (
                <button
                  key={`${chip.en}-${chip.zh}`}
                  type="button"
                  className="lchat-suggestion-chip"
                  onClick={() => void sendUserMessage(chip[language])}
                  disabled={isLoading}
                >
                  {chip[language]}
                </button>
              ))}
            </div>
          ) : null}

          <form className="lchat-form" onSubmit={handleSubmit}>
            <textarea
              ref={textareaRef}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={onTextareaKeyDown}
              placeholder={copy.placeholder}
              rows={1}
              maxLength={MAX_INPUT_CHARS}
            />
            <div className="lchat-form-footer">
              <small>
                {draft.length}/{MAX_INPUT_CHARS}
              </small>
              <button type="submit" disabled={!canSend} aria-label={copy.sendMessageAria}>
                <SendIcon />
                <span>{copy.send}</span>
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
