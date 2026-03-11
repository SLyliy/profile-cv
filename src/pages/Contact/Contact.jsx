import { useEffect, useRef, useState } from "react";
import { useScrollReveal } from "../../utils/useScrollReveal";
import "../Home/Home.css";
import "./Contact.css";
import cover2Img from "../../assets/cover2.jpg";
import { useLanguage } from "../../i18n/language-context";

const TURNSTILE_SCRIPT_ID = "cf-turnstile-script";
const TURNSTILE_SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

const CONTACT_COPY = {
  en: {
    heroTitle: "Get In Touch",
    heroSubtitle: "Let's connect and collaborate",
    boardTitle: "Message Board",
    boardSubtitle:
      "Open to internship opportunities, UI feedback, and collaboration ideas. Leave a note and I will get back to you soon.",
    infoTitle: "Glad to Connect With You",
    infoSub: "Let us stay in touch",
    intro:
      "Whether you want to discuss coursework, share a project idea, or ask for design feedback, feel free to reach out. I review every message carefully.",
    emailLabel: "Email",
    emailNote: "Replies within 24 hours on weekdays.",
    phoneLabel: "Phone",
    phoneNote: "Best for urgent or time-sensitive messages.",
    locationLabel: "Location",
    locationNote: "Open to remote collaboration.",
    timeLabel: "Best Contact Time",
    timeValue: "Mon-Fri: 6:00-9:30 PM (AEST)",
    timeNote: "Weekends: 10:00 AM-6:00 PM",
    socialTitle: "Social Platforms",
    formTitle: "Send a Message",
    formSub: "I will reply soon",
    fullName: "Full Name",
    fullNamePlaceholder: "Enter your full name",
    emailAddress: "Email Address",
    emailPlaceholder: "Enter your email address",
    topicLabel: "Message Topic",
    topicPlaceholder: "Select a topic",
    topics: {
      internship: "Internship Opportunity",
      collaboration: "Project Collaboration",
      feedback: "UI Feedback",
      general: "General Inquiry",
    },
    messageLabel: "Message",
    messagePlaceholder: "Share a few details about your request...",
    subscribeLabel: "Subscribe to portfolio updates and project releases.",
    missingTurnstile: "Turnstile site key is missing.",
    sending: "Sending...",
    sendMessage: "Send Message",
    commonQuestions: "Common Questions",
    faqs: [
      {
        question: "Can I request UI feedback on a project?",
        answer:
          "Absolutely. Share a short brief or link and I can provide structured, design-focused feedback within a day.",
      },
      {
        question: "Are you available for collaboration?",
        answer:
          "Yes, especially for front-end prototypes or UI polish. I am open to short-term and semester-long projects.",
      },
      {
        question: "What response time can I expect?",
        answer:
          "Messages are typically answered within 24 hours on weekdays. Weekend replies may take a bit longer.",
      },
      {
        question: "Do you share learning resources?",
        answer:
          "Yes. I can recommend UI systems, portfolio references, and front-end learning paths based on your goals.",
      },
    ],
    modalSuccessTitle: "Message sent",
    modalErrorTitle: "Send failed",
    modalSuccessText: "We've sent a confirmation email to your inbox.",
    close: "Close",
    errors: {
      siteKeyMissing: "Turnstile site key is missing.",
      completeVerification: "Please complete the Turnstile verification.",
      submitFailed: "Failed to send message.",
      invalidEmail: "Please enter a valid email address.",
      fieldsRequired: "Please complete your name, email, and message.",
      tokenRequired: "Please complete the Turnstile verification.",
      verificationFailed: "Turnstile verification failed. Please try again.",
      rateLimited: "Too many requests. Please wait a minute and try again.",
      internalError: "The server is temporarily unavailable. Please try again later.",
    },
  },
  zh: {
    heroTitle: "联系我",
    heroSubtitle: "欢迎交流与合作",
    boardTitle: "留言板",
    boardSubtitle:
      "目前开放实习机会、UI 反馈与合作交流。欢迎留下你的想法，我会尽快回复。",
    infoTitle: "很高兴认识你",
    infoSub: "保持联系",
    intro:
      "无论你想讨论课程、分享项目想法，还是需要设计反馈，都欢迎联系我。我会认真阅读每一条消息。",
    emailLabel: "邮箱",
    emailNote: "工作日通常 24 小时内回复。",
    phoneLabel: "电话",
    phoneNote: "更适合紧急或时效性较强的沟通。",
    locationLabel: "所在地",
    locationNote: "支持远程协作。",
    timeLabel: "合适联系时间",
    timeValue: "周一至周五：6:00-9:30 PM (AEST)",
    timeNote: "周末：10:00 AM-6:00 PM",
    socialTitle: "社交平台",
    formTitle: "发送消息",
    formSub: "我会尽快回复",
    fullName: "姓名",
    fullNamePlaceholder: "请输入你的姓名",
    emailAddress: "邮箱地址",
    emailPlaceholder: "请输入你的邮箱地址",
    topicLabel: "消息主题",
    topicPlaceholder: "请选择主题",
    topics: {
      internship: "实习机会",
      collaboration: "项目合作",
      feedback: "UI 反馈",
      general: "一般咨询",
    },
    messageLabel: "留言内容",
    messagePlaceholder: "简单描述一下你的需求...",
    subscribeLabel: "订阅作品集更新与项目发布通知。",
    missingTurnstile: "缺少 Turnstile 站点密钥。",
    sending: "发送中...",
    sendMessage: "发送消息",
    commonQuestions: "常见问题",
    faqs: [
      {
        question: "可以请你帮忙看项目的 UI 吗？",
        answer: "可以。你可以发来简介或链接，我通常会在一天内给出结构化的设计反馈。",
      },
      {
        question: "你接受合作吗？",
        answer: "接受，尤其是前端原型或 UI 打磨类合作，也欢迎短期或学期项目。",
      },
      {
        question: "一般多久能收到回复？",
        answer: "工作日通常会在 24 小时内回复，周末可能会稍慢一些。",
      },
      {
        question: "你会分享学习资源吗？",
        answer: "会。我可以结合你的目标推荐 UI 系统、作品集参考和前端学习路径。",
      },
    ],
    modalSuccessTitle: "发送成功",
    modalErrorTitle: "发送失败",
    modalSuccessText: "确认邮件已经发送到你的邮箱。",
    close: "关闭",
    errors: {
      siteKeyMissing: "缺少 Turnstile 站点密钥。",
      completeVerification: "请先完成 Turnstile 验证。",
      submitFailed: "消息发送失败，请稍后再试。",
      invalidEmail: "请输入有效的邮箱地址。",
      fieldsRequired: "请完整填写姓名、邮箱和留言内容。",
      tokenRequired: "请先完成 Turnstile 验证。",
      verificationFailed: "Turnstile 验证失败，请重试。",
      rateLimited: "请求过于频繁，请稍后一分钟再试。",
      internalError: "服务器暂时不可用，请稍后再试。",
    },
  },
};

function localizeContactError(message, copy, language) {
  const text = String(message || "").trim();
  if (!text) {
    return copy.errors.submitFailed;
  }

  if (language !== "zh") {
    return text;
  }

  const normalized = text.toLowerCase();

  if (normalized.includes("turnstile site key")) return copy.errors.siteKeyMissing;
  if (normalized.includes("complete the turnstile verification")) {
    return copy.errors.completeVerification;
  }
  if (normalized.includes("invalid email")) return copy.errors.invalidEmail;
  if (normalized.includes("full name, email and message are required")) {
    return copy.errors.fieldsRequired;
  }
  if (normalized.includes("turnstile token is required")) {
    return copy.errors.tokenRequired;
  }
  if (normalized.includes("turnstile verification failed")) {
    return copy.errors.verificationFailed;
  }
  if (normalized.includes("too many requests")) return copy.errors.rateLimited;
  if (
    normalized.includes("internal server error") ||
    normalized.includes("server environment") ||
    normalized.includes("failed to send email")
  ) {
    return copy.errors.internalError;
  }

  return copy.errors.submitFailed;
}

export default function Contact() {
  useScrollReveal();

  const { language } = useLanguage();
  const copy = CONTACT_COPY[language];

  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;
  const turnstileContainerRef = useRef(null);
  const turnstileWidgetIdRef = useRef(null);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState({ type: "", message: "" });

  const closeSubmitModal = () => {
    setSubmitState({ type: "", message: "" });
  };

  useEffect(() => {
    if (!siteKey) {
      return undefined;
    }

    const renderWidget = () => {
      if (
        !window.turnstile ||
        !turnstileContainerRef.current ||
        turnstileWidgetIdRef.current !== null
      ) {
        return;
      }

      turnstileWidgetIdRef.current = window.turnstile.render(
        turnstileContainerRef.current,
        {
          sitekey: siteKey,
          callback: (token) => setTurnstileToken(token),
          "expired-callback": () => setTurnstileToken(""),
          "error-callback": () => setTurnstileToken(""),
        }
      );
    };

    if (window.turnstile) {
      renderWidget();
    } else {
      const existingScript = document.getElementById(TURNSTILE_SCRIPT_ID);
      if (existingScript) {
        existingScript.addEventListener("load", renderWidget);
      } else {
        const script = document.createElement("script");
        script.id = TURNSTILE_SCRIPT_ID;
        script.src = TURNSTILE_SCRIPT_SRC;
        script.async = true;
        script.defer = true;
        script.addEventListener("load", renderWidget);
        document.head.appendChild(script);
      }
    }

    return () => {
      const script = document.getElementById(TURNSTILE_SCRIPT_ID);
      if (script) {
        script.removeEventListener("load", renderWidget);
      }
      if (window.turnstile && turnstileWidgetIdRef.current !== null) {
        window.turnstile.remove(turnstileWidgetIdRef.current);
        turnstileWidgetIdRef.current = null;
      }
    };
  }, [siteKey]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formElement = event.currentTarget;

    if (isSubmitting) {
      return;
    }

    if (!siteKey) {
      setSubmitState({
        type: "error",
        message: copy.errors.siteKeyMissing,
      });
      return;
    }

    if (!turnstileToken) {
      setSubmitState({
        type: "error",
        message: copy.errors.completeVerification,
      });
      return;
    }

    const formData = new FormData(formElement);
    const payload = {
      fullName: String(formData.get("fullName") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      topic: String(formData.get("topic") || ""),
      message: String(formData.get("message") || "").trim(),
      subscribe: formData.get("subscribe") === "on",
      turnstileToken,
    };

    setSubmitState({ type: "", message: "" });
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.ok) {
        throw new Error(data.error || copy.errors.submitFailed);
      }

      setSubmitState({
        type: "success",
        message: copy.modalSuccessText,
      });
      formElement.reset();
      setTurnstileToken("");
      if (window.turnstile && turnstileWidgetIdRef.current !== null) {
        window.turnstile.reset(turnstileWidgetIdRef.current);
      }
    } catch (error) {
      setSubmitState({
        type: "error",
        message: localizeContactError(
          error instanceof Error ? error.message : copy.errors.submitFailed,
          copy,
          language
        ),
      });
      setTurnstileToken("");
      if (window.turnstile && turnstileWidgetIdRef.current !== null) {
        window.turnstile.reset(turnstileWidgetIdRef.current);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section className="contact-hero" style={{ backgroundImage: `url(${cover2Img})` }}>
        <div className="contact-hero-content">
          <h1 className="contact-hero-title" data-reveal style={{ "--reveal-delay": "0.05s" }}>
            {copy.heroTitle}
          </h1>
          <p className="contact-hero-subtitle" data-reveal style={{ "--reveal-delay": "0.12s" }}>
            {copy.heroSubtitle}
          </p>
        </div>
      </section>

      <div className="contact-page">
        <section className="contact-header" aria-labelledby="contact-title">
          <div className="section-title contact-title" id="contact-title" data-reveal>
            {copy.boardTitle}
          </div>
          <p className="contact-subtitle" data-reveal style={{ "--reveal-delay": "0.08s" }}>
            {copy.boardSubtitle}
          </p>
        </section>

        <section className="section-wrap contact-wrap">
          <div className="panel contact-shell" data-reveal style={{ "--reveal-delay": "0.05s" }}>
            <div className="panel-inner">
              <article className="block contact-card" data-reveal style={{ "--reveal-delay": "0.05s" }}>
                <div className="panel-header">
                  <div className="panel-title">
                    <span className="dot" aria-hidden="true"></span>
                    {copy.infoTitle}
                  </div>
                  <div className="panel-sub">{copy.infoSub}</div>
                </div>

                <div className="contact-card-body">
                  <p className="contact-intro">{copy.intro}</p>

                  <div className="contact-list">
                    <div className="contact-item">
                      <span className="mini-ico" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none">
                          <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v9A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-9Z" stroke="rgba(31,35,64,.6)" strokeWidth="2"/>
                          <path d="m6.5 8 5.5 4 5.5-4" stroke="rgba(31,35,64,.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                      <div>
                        <div className="contact-label">{copy.emailLabel}</div>
                        <div className="contact-value">l11090868@gmail.com</div>
                        <div className="contact-note">{copy.emailNote}</div>
                      </div>
                    </div>

                    <div className="contact-item">
                      <span className="mini-ico" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none">
                          <path d="M5 5.5C7 10 10 13 14.5 19L18 16.5c.6-.4 1.4-.3 2 .2l1 1" stroke="rgba(31,35,64,.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M5 5.5 3.5 7c-.5.5-.6 1.2-.3 1.8 1.5 3.1 4.9 7.7 8 9.2.6.3 1.3.2 1.8-.3l1.5-1.5" stroke="rgba(31,35,64,.45)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                      <div>
                        <div className="contact-label">{copy.phoneLabel}</div>
                        <div className="contact-value">+86 19999129835</div>
                        <div className="contact-note">{copy.phoneNote}</div>
                      </div>
                    </div>

                    <div className="contact-item">
                      <span className="mini-ico" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none">
                          <path d="M12 21s7-4.4 7-10a7 7 0 1 0-14 0c0 5.6 7 10 7 10Z" stroke="rgba(31,35,64,.55)" strokeWidth="2" strokeLinecap="round"/>
                          <path d="M12 11.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" fill="rgba(31,35,64,.35)" />
                        </svg>
                      </span>
                      <div>
                        <div className="contact-label">{copy.locationLabel}</div>
                        <div className="contact-value">Sydney, Australia</div>
                        <div className="contact-note">{copy.locationNote}</div>
                      </div>
                    </div>

                    <div className="contact-item">
                      <span className="mini-ico" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none">
                          <path d="M4.5 8h15" stroke="rgba(31,35,64,.55)" strokeWidth="2" strokeLinecap="round"/>
                          <path d="M7 3v3M17 3v3" stroke="rgba(31,35,64,.55)" strokeWidth="2" strokeLinecap="round"/>
                          <path d="M6 13h6" stroke="rgba(31,35,64,.4)" strokeWidth="2" strokeLinecap="round"/>
                          <path d="M6 17h10" stroke="rgba(31,35,64,.4)" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </span>
                      <div>
                        <div className="contact-label">{copy.timeLabel}</div>
                        <div className="contact-value">{copy.timeValue}</div>
                        <div className="contact-note">{copy.timeNote}</div>
                      </div>
                    </div>
                  </div>

                  <div className="contact-social">
                    <div className="contact-social-title">{copy.socialTitle}</div>
                    <div className="contact-social-list">
                      <span className="pill">GitHub</span>
                      <span className="pill">LinkedIn</span>
                      <span className="pill">Behance</span>
                      <span className="pill">Figma</span>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </div>

          <div className="panel contact-shell" data-reveal style={{ "--reveal-delay": "0.12s" }}>
            <div className="panel-inner">
              <article className="block contact-card" data-reveal style={{ "--reveal-delay": "0.12s" }}>
                <div className="panel-header">
                  <div className="panel-title">
                    <span className="dot" aria-hidden="true"></span>
                    {copy.formTitle}
                  </div>
                  <div className="panel-sub">{copy.formSub}</div>
                </div>

                <div className="contact-card-body">
                  <form className="contact-form" onSubmit={handleSubmit}>
                    <label className="contact-field">
                      <span className="contact-field-label">
                        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" stroke="rgba(31,35,64,.55)" strokeWidth="2" />
                          <path d="M4 20c1.2-4.6 14.8-4.6 16 0" stroke="rgba(31,35,64,.45)" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        {copy.fullName}
                      </span>
                      <input type="text" name="fullName" placeholder={copy.fullNamePlaceholder} required />
                    </label>

                    <label className="contact-field">
                      <span className="contact-field-label">
                        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v9A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-9Z" stroke="rgba(31,35,64,.55)" strokeWidth="2"/>
                          <path d="m6.5 8 5.5 4 5.5-4" stroke="rgba(31,35,64,.55)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {copy.emailAddress}
                      </span>
                      <input type="email" name="email" placeholder={copy.emailPlaceholder} required />
                    </label>

                    <label className="contact-field">
                      <span className="contact-field-label">
                        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path d="M5 5h14v10H7l-2 4V5Z" stroke="rgba(31,35,64,.55)" strokeWidth="2" strokeLinejoin="round"/>
                          <path d="M8 9h8M8 12h6" stroke="rgba(31,35,64,.45)" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        {copy.topicLabel}
                      </span>
                      <select name="topic" defaultValue="">
                        <option value="" disabled>{copy.topicPlaceholder}</option>
                        <option value="internship">{copy.topics.internship}</option>
                        <option value="collaboration">{copy.topics.collaboration}</option>
                        <option value="feedback">{copy.topics.feedback}</option>
                        <option value="general">{copy.topics.general}</option>
                      </select>
                    </label>

                    <label className="contact-field">
                      <span className="contact-field-label">
                        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v11A2.5 2.5 0 0 1 17.5 20h-11A2.5 2.5 0 0 1 4 17.5v-11Z" stroke="rgba(31,35,64,.55)" strokeWidth="2"/>
                          <path d="M8 9h8M8 12h8M8 15h6" stroke="rgba(31,35,64,.45)" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        {copy.messageLabel}
                      </span>
                      <textarea
                        name="message"
                        rows="4"
                        maxLength="2000"
                        placeholder={copy.messagePlaceholder}
                        required
                      />
                    </label>

                    <label className="contact-checkbox">
                      <input type="checkbox" name="subscribe" />
                      {copy.subscribeLabel}
                    </label>

                    <div className="contact-turnstile-wrap">
                      {siteKey ? (
                        <div ref={turnstileContainerRef} className="contact-turnstile" />
                      ) : (
                        <p className="contact-status contact-status-error">
                          {copy.missingTurnstile}
                        </p>
                      )}
                    </div>

                    <button className="btn btn-primary contact-submit" type="submit" disabled={isSubmitting}>
                      {isSubmitting ? copy.sending : copy.sendMessage}
                    </button>
                  </form>
                </div>
              </article>
            </div>
          </div>
        </section>

        <div className="section-title" data-reveal>
          {copy.commonQuestions}
        </div>

        <section className="cards contact-faq">
          {copy.faqs.map((faq, index) => (
            <article
              key={faq.question}
              className="card"
              data-reveal
              style={{ "--reveal-delay": `${0.04 + index * 0.04}s` }}
            >
              <h4>{faq.question}</h4>
              <p>{faq.answer}</p>
            </article>
          ))}
        </section>
      </div>

      {submitState.message ? (
        <div className="contact-modal-overlay" onClick={closeSubmitModal}>
          <div
            className="contact-modal-content"
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-submit-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="contact-modal-icon">
              {submitState.type === "success" ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" fill="#10B981"/>
                  <path d="M7.5 12L10.5 15L16.5 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" fill="#EF4444"/>
                  <path d="M15 9L9 15M9 9L15 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>

            <h2 className="contact-modal-title" id="contact-submit-title">
              {submitState.type === "success" ? copy.modalSuccessTitle : copy.modalErrorTitle}
            </h2>

            <p className="contact-modal-text">
              {submitState.type === "success" ? copy.modalSuccessText : submitState.message}
            </p>

            <button
              className="btn contact-modal-action"
              type="button"
              onClick={closeSubmitModal}
            >
              {copy.close}
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
