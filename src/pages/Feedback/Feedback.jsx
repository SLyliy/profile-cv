import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useScrollReveal } from "../../utils/useScrollReveal";
import { supabase } from "../../lib/supabaseClient";
import "./Feedback.css";
import snowBg from "../../assets/snow.jpg";
import cover2Img from "../../assets/cover2.jpg";
import { useLanguage } from "../../i18n/language-context";

const HEART_WIDTH = 940;
const HEART_HEIGHT = 860;
const POLL_INTERVAL_MS = 8000;
const MAX_WORDS = 130;
const MAX_MESSAGE_LENGTH = 120;
const DEFAULT_QUICK_PICK_COUNT = 24;
const DAY_MS = 24 * 60 * 60 * 1000;

const TIME_OPTIONS = [
  {
    value: "24h",
    labels: {
      en: "Last 24h",
      zh: "最近 24 小时",
    },
  },
  {
    value: "7d",
    labels: {
      en: "7d",
      zh: "7 天",
    },
  },
  {
    value: "all",
    labels: {
      en: "All",
      zh: "全部",
    },
  },
];

const MODE_OPTIONS = [
  {
    value: "all",
    labels: {
      en: "All",
      zh: "全部",
    },
  },
  {
    value: "positive",
    labels: {
      en: "Positive",
      zh: "正向",
    },
  },
  {
    value: "neutral",
    labels: {
      en: "Neutral",
      zh: "中性",
    },
  },
  {
    value: "negative",
    labels: {
      en: "Negative",
      zh: "负向",
    },
  },
];

const SORT_OPTIONS = [
  {
    value: "trending",
    labels: {
      en: "Trending",
      zh: "趋势",
    },
  },
  {
    value: "most",
    labels: {
      en: "Most used",
      zh: "最高频",
    },
  },
];

const QUICK_PICKS = [
  {
    tone: "positive",
    labels: {
      en: "like",
      zh: "喜欢",
    },
  },
  {
    tone: "positive",
    labels: {
      en: "Love it!",
      zh: "太喜欢了！",
    },
  },
  {
    tone: "positive",
    labels: {
      en: "Beautiful",
      zh: "好看",
    },
  },
  {
    tone: "positive",
    labels: {
      en: "Clean",
      zh: "干净",
    },
  },
  {
    tone: "positive",
    labels: {
      en: "Elegant",
      zh: "优雅",
    },
  },
  {
    tone: "positive",
    labels: {
      en: "Neat",
      zh: "整洁",
    },
  },
  {
    tone: "positive",
    labels: {
      en: "Smooth",
      zh: "顺滑",
    },
  },
  {
    tone: "positive",
    labels: {
      en: "Cozy",
      zh: "舒适",
    },
  },
  {
    tone: "positive",
    labels: {
      en: "Aesthetic",
      zh: "有美感",
    },
  },
  {
    tone: "positive",
    labels: {
      en: "Professional",
      zh: "专业",
    },
  },
  {
    tone: "positive",
    labels: {
      en: "Creative",
      zh: "有创意",
    },
  },
  {
    tone: "positive",
    labels: {
      en: "Impressive",
      zh: "令人印象深刻",
    },
  },
  {
    tone: "negative",
    labels: {
      en: "dislike",
      zh: "不喜欢",
    },
  },
  {
    tone: "neutral",
    labels: {
      en: "Simple",
      zh: "简洁",
    },
  },
  {
    tone: "neutral",
    labels: {
      en: "Modern",
      zh: "现代",
    },
  },
  {
    tone: "neutral",
    labels: {
      en: "Intuitive",
      zh: "直观",
    },
  },
  {
    tone: "neutral",
    labels: {
      en: "Soft",
      zh: "柔和",
    },
  },
  {
    tone: "neutral",
    labels: {
      en: "Plain",
      zh: "朴素",
    },
  },
  {
    tone: "neutral",
    labels: {
      en: "Comfortable",
      zh: "舒服",
    },
  },
  {
    tone: "negative",
    labels: {
      en: "Cluttered",
      zh: "杂乱",
    },
  },
  {
    tone: "negative",
    labels: {
      en: "Hard to read",
      zh: "难阅读",
    },
  },
  {
    tone: "negative",
    labels: {
      en: "Boring",
      zh: "无聊",
    },
  },
];

const WORD_COLORS = [
  "rgba(63, 84, 155, 0.95)",
  "rgba(65, 147, 201, 0.92)",
  "rgba(83, 168, 154, 0.9)",
  "rgba(98, 113, 186, 0.9)",
  "rgba(125, 154, 212, 0.88)",
  "rgba(110, 168, 121, 0.9)",
  "rgba(92, 127, 200, 0.9)",
  "rgba(132, 146, 192, 0.9)",
];

const FEEDBACK_COPY = {
  en: {
    heroTitle: "Share Your Thought",
    heroSubtitle: "Tap a word, or leave a short note. It shows up for everyone.",
    mainTitle: "How does this website feel to you?",
    mainSubtitle:
      "Feel free to share any expression. It will be permanently recorded on this webpage.",
    controlsAria: "Word cloud controls",
    timeLabel: "Time",
    modeLabel: "Mode",
    sortLabel: "Sort",
    actionLabel: "Action",
    download: "Download",
    share: "Share",
    loadingMessages: "Loading messages...",
    noMessages: "No messages match this filter yet.",
    wordCloudAria: "Feedback heart word cloud",
    wordLabel: "Word",
    countLabel: "Count",
    lastSeenLabel: "Last seen",
    quickPicksTitle: "Quick picks",
    showLess: "Show less",
    showMore: "+ more",
    inputLabel: "Message content",
    inputPlaceholder: (max) => `Write a message (max ${max} chars)`,
    send: "Send",
    sending: "Sending...",
    dockNote: "Your message will appear in the word cloud after submission.",
    sendAnother: "Send another",
    backToCloud: "Back to word cloud",
    successSubtitle: "You can keep sharing, or jump back to check the cloud.",
    noDataToDownload: "No data to download yet.",
    csvDownloaded: "Word cloud CSV downloaded.",
    shareTitle: "Feedback Word Cloud",
    noWordsYet: "No words yet.",
    shared: "Snapshot shared.",
    copied: "Snapshot copied to clipboard.",
    shareUnsupported: "Share is not supported on this browser.",
    shareCancelled: "Share cancelled.",
    emptyMessage: "Please write a message first.",
    messageTooLong: (max) => `Message must be within ${max} characters.`,
    sendFailed: (message) => `Send failed: ${message}`,
    successMessage: "Thanks! Your message is now in the cloud.",
    loadingFailed: (message) => `Loading failed: ${message}`,
    messagesMeta: (count, unique) => `${count} messages, ${unique} unique words`,
    shareSummary: ({ timeLabel, modeLabel, sortLabel, topWords }) =>
      `Time: ${timeLabel} | Mode: ${modeLabel} | Sort: ${sortLabel}.\nTop words: ${topWords || "No words yet."}`,
    unknownTime: "Unknown",
    justNow: "just now",
    minutesAgo: (value) => `${value}m ago`,
    hoursAgo: (value) => `${value}h ago`,
    daysAgo: (value) => `${value}d ago`,
    weeksAgo: (value) => `${value}w ago`,
  },
  zh: {
    heroTitle: "留下你的感受",
    heroSubtitle: "点一个词，或者写一小句，大家都能看到。",
    mainTitle: "这个网站给你的感觉是什么？",
    mainSubtitle: "欢迎留下任何表达，它会被持续记录在这个页面里。",
    controlsAria: "词云控制项",
    timeLabel: "时间",
    modeLabel: "情绪",
    sortLabel: "排序",
    actionLabel: "操作",
    download: "下载",
    share: "分享",
    loadingMessages: "正在加载留言...",
    noMessages: "当前筛选条件下还没有留言。",
    wordCloudAria: "反馈爱心词云",
    wordLabel: "词条",
    countLabel: "次数",
    lastSeenLabel: "最近出现",
    quickPicksTitle: "快捷词条",
    showLess: "收起",
    showMore: "更多 +",
    inputLabel: "留言内容",
    inputPlaceholder: (max) => `写一句留言（最多 ${max} 字）`,
    send: "发送",
    sending: "发送中...",
    dockNote: "提交后，你的留言会出现在上方词云中。",
    sendAnother: "继续发送",
    backToCloud: "回到词云",
    successSubtitle: "你可以继续留言，或者回去看看词云变化。",
    noDataToDownload: "当前还没有可下载的数据。",
    csvDownloaded: "词云 CSV 已下载。",
    shareTitle: "反馈词云",
    noWordsYet: "还没有词条。",
    shared: "快照已分享。",
    copied: "快照已复制到剪贴板。",
    shareUnsupported: "当前浏览器不支持分享。",
    shareCancelled: "已取消分享。",
    emptyMessage: "请先写点内容。",
    messageTooLong: (max) => `留言需控制在 ${max} 字以内。`,
    sendFailed: (message) => `发送失败：${message}`,
    successMessage: "谢谢，你的留言已经进入词云。",
    loadingFailed: (message) => `加载失败：${message}`,
    messagesMeta: (count, unique) => `${count} 条留言，${unique} 个不同词条`,
    shareSummary: ({ timeLabel, modeLabel, sortLabel, topWords }) =>
      `时间：${timeLabel} | 情绪：${modeLabel} | 排序：${sortLabel}\n高频词：${topWords || "还没有词条。"}`,
    unknownTime: "未知",
    justNow: "刚刚",
    minutesAgo: (value) => `${value} 分钟前`,
    hoursAgo: (value) => `${value} 小时前`,
    daysAgo: (value) => `${value} 天前`,
    weeksAgo: (value) => `${value} 周前`,
  },
};

const FEEDBACK_TEXT_TRANSLATIONS = QUICK_PICKS.reduce(
  (acc, item) => {
    const english = item.labels.en.toLowerCase();
    const chinese = item.labels.zh.toLowerCase();

    acc.en[english] = item.labels.en;
    acc.en[chinese] = item.labels.en;
    acc.zh[english] = item.labels.zh;
    acc.zh[chinese] = item.labels.zh;

    return acc;
  },
  {
    en: {},
    zh: {},
  }
);

const SENTIMENT_WORDS = QUICK_PICKS.reduce(
  (acc, item) => {
    acc[item.tone].add(item.labels.en.toLowerCase());
    acc[item.tone].add(item.labels.zh.toLowerCase());
    return acc;
  },
  {
    positive: new Set([
      "like",
      "professional",
      "creative",
      "impressive",
      "comfortable",
      "喜欢",
      "专业",
      "有创意",
      "令人印象深刻",
      "舒服",
    ]),
    neutral: new Set(["soft", "柔和"]),
    negative: new Set([]),
  }
);

function normalizeMessage(value) {
  return value.trim().replace(/\s+/g, " ");
}

function classifySentiment(value) {
  const text = normalizeMessage(value || "").toLowerCase();
  if (!text) {
    return "neutral";
  }

  if (SENTIMENT_WORDS.positive.has(text)) {
    return "positive";
  }
  if (SENTIMENT_WORDS.negative.has(text)) {
    return "negative";
  }
  if (SENTIMENT_WORDS.neutral.has(text)) {
    return "neutral";
  }

  if (
    /(love|great|good|nice|beautiful|clean|elegant|smooth|cozy|aesthetic|awesome|impressive|喜欢|好看|干净|优雅|顺滑|舒适|有美感|专业|有创意)/.test(text)
  ) {
    return "positive";
  }
  if (/(dislike|bad|boring|cluttered|hard|messy|confusing|ugly|slow|不喜欢|无聊|杂乱|难阅读|混乱|难用)/.test(text)) {
    return "negative";
  }

  return "neutral";
}

function getRangeWindowMs(value) {
  if (value === "24h") return DAY_MS;
  if (value === "7d") return DAY_MS * 7;
  return null;
}

function parseTimestamp(value) {
  const ts = Date.parse(value || "");
  return Number.isFinite(ts) ? ts : 0;
}

function formatTimeAgo(value, copy) {
  const ts = parseTimestamp(value);
  if (!ts) {
    return copy.unknownTime;
  }

  const diff = Date.now() - ts;
  if (diff < 60 * 1000) return copy.justNow;
  if (diff < 60 * 60 * 1000) {
    return copy.minutesAgo(Math.max(1, Math.round(diff / (60 * 1000))));
  }
  if (diff < DAY_MS) {
    return copy.hoursAgo(Math.max(1, Math.round(diff / (60 * 60 * 1000))));
  }
  if (diff < DAY_MS * 7) {
    return copy.daysAgo(Math.max(1, Math.round(diff / DAY_MS)));
  }
  return copy.weeksAgo(Math.max(1, Math.round(diff / (DAY_MS * 7))));
}

function getLocalizedFeedbackText(text, language) {
  const normalized = normalizeMessage(text || "").toLowerCase();
  if (!normalized) {
    return "";
  }

  return FEEDBACK_TEXT_TRANSLATIONS[language][normalized] || text;
}

function toCsvCell(value) {
  const text = String(value ?? "");
  if (!/[,"\n]/.test(text)) {
    return text;
  }
  return `"${text.replace(/"/g, "\"\"")}"`;
}

function isInsideHeartNormalized(x, y) {
  const yScaled = y * 1.15;
  const a = x * x + yScaled * yScaled - 1;
  return a * a * a - x * x * yScaled * yScaled * yScaled <= 0;
}

function isInsideHeartPixel(x, y, width, height) {
  const nx = (x - width * 0.5) / (width * 0.5);
  const ny = (height * 0.5 - y) / (height * 0.5);
  return isInsideHeartNormalized(nx, ny);
}

function buildHeartCandidates(width, height, step = 14) {
  const cx = width * 0.5;
  const cy = height * 0.5;
  const points = [];

  for (let y = step; y < height - step; y += step) {
    for (let x = step; x < width - step; x += step) {
      const nx = (x - cx) / (width * 0.5);
      const ny = (cy - y) / (height * 0.5);

      if (!isInsideHeartNormalized(nx, ny)) {
        continue;
      }

      points.push({
        x,
        y,
        distance: nx * nx + ny * ny * 1.22,
      });
    }
  }

  points.sort((a, b) => a.distance - b.distance);
  return points;
}

function estimateWordWidth(text, fontSize) {
  const hasCjk = /[\u3400-\u9FFF]/.test(text);
  const ratio = hasCjk ? 0.98 : 0.6;
  return text.length * fontSize * ratio + 10;
}

function hasOverlap(box, placed, padding = 4) {
  return placed.some((item) => {
    return !(
      box.right + padding < item.left ||
      box.left - padding > item.right ||
      box.bottom + padding < item.top ||
      box.top - padding > item.bottom
    );
  });
}

function aggregateFeedback(rows, nowTs = Date.now()) {
  const map = new Map();
  const dayAgo = nowTs - DAY_MS;
  const weekAgo = nowTs - DAY_MS * 7;

  rows.forEach((row) => {
    const normalized = normalizeMessage(row.text || "");
    if (!normalized) {
      return;
    }

    const ts = parseTimestamp(row.created_at);
    const existing = map.get(normalized);

    if (existing) {
      existing.count += 1;
      if (ts > existing.latestTs) {
        existing.latestTs = ts;
        existing.latestAt = row.created_at || "";
      }
      if (ts >= dayAgo) {
        existing.recent24h += 1;
      }
      if (ts >= weekAgo) {
        existing.recent7d += 1;
      }
      return;
    }

    map.set(normalized, {
      text: normalized,
      count: 1,
      latestAt: row.created_at || "",
      latestTs: ts,
      recent24h: ts >= dayAgo ? 1 : 0,
      recent7d: ts >= weekAgo ? 1 : 0,
    });
  });

  return Array.from(map.values());
}

function getTrendingScore(entry, nowTs = Date.now()) {
  const age = Math.max(0, nowTs - entry.latestTs);
  const recencyBoost = Math.max(0, 1 - age / (DAY_MS * 3));
  return entry.recent24h * 4.4 + entry.recent7d * 1.3 + entry.count * 0.35 + recencyBoost * 3.2;
}

function sortEntries(entries, sortMode, nowTs = Date.now()) {
  const next = [...entries];
  if (sortMode === "most") {
    return next.sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      if (b.latestTs !== a.latestTs) return b.latestTs - a.latestTs;
      return a.text.localeCompare(b.text, "zh-Hans-CN");
    });
  }

  return next.sort((a, b) => {
    const scoreDiff = getTrendingScore(b, nowTs) - getTrendingScore(a, nowTs);
    if (Math.abs(scoreDiff) > 1e-6) return scoreDiff;
    if (b.count !== a.count) return b.count - a.count;
    return a.text.localeCompare(b.text, "zh-Hans-CN");
  });
}

function computeHeartLayout(entries, width, height) {
  const words = entries.slice(0, MAX_WORDS);
  if (!words.length) {
    return [];
  }

  const candidates = buildHeartCandidates(width, height, 14);
  const maxCount = words[0].count;
  const minCount = words[words.length - 1].count;
  const countSpan = Math.max(1, maxCount - minCount);
  const maxFont = words.length > 75 ? 88 : 95;
  const minFont = 26;
  const placed = [];

  words.forEach((word, index) => {
    const weight = (word.count - minCount) / countSpan;
    let baseSize = minFont + weight * (maxFont - minFont);

    const maxAllowedWidth = width * 0.88;
    const estimated = estimateWordWidth(word.text, baseSize);
    if (estimated > maxAllowedWidth) {
      baseSize = (maxAllowedWidth - 10) / (Math.max(1, word.text.length) * 0.9);
    }

    let selected = null;

    for (let shrink = 0; shrink < 4 && !selected; shrink += 1) {
      const fontSize = Math.max(minFont - 2, baseSize - shrink * 4);
      const wordWidth = estimateWordWidth(word.text, fontSize);
      const wordHeight = fontSize * 1.06;
      const start = (index * 37 + shrink * 113) % candidates.length;

      for (let offset = 0; offset < candidates.length; offset += 1) {
        const point = candidates[(start + offset) % candidates.length];
        const left = point.x - wordWidth * 0.5;
        const top = point.y - wordHeight * 0.5;
        const box = {
          left,
          top,
          right: left + wordWidth,
          bottom: top + wordHeight,
        };

        if (box.left < 0 || box.top < 0 || box.right > width || box.bottom > height) {
          continue;
        }

        const inside =
          isInsideHeartPixel(box.left, box.top, width, height) &&
          isInsideHeartPixel(box.right, box.top, width, height) &&
          isInsideHeartPixel(box.left, box.bottom, width, height) &&
          isInsideHeartPixel(box.right, box.bottom, width, height);

        if (!inside || hasOverlap(box, placed, 4)) {
          continue;
        }

        selected = {
          text: word.text,
          count: word.count,
          latestAt: word.latestAt,
          fontSize,
          x: point.x,
          y: point.y,
          left: box.left,
          top: box.top,
          right: box.right,
          bottom: box.bottom,
          color: WORD_COLORS[(index + word.count) % WORD_COLORS.length],
        };
        break;
      }
    }

    if (selected) {
      placed.push(selected);
    }
  });

  return placed;
}

export default function Feedback() {
  useScrollReveal();
  const { language } = useLanguage();
  const copy = FEEDBACK_COPY[language];

  const inputRef = useRef(null);
  const cloudStageRef = useRef(null);

  const [rows, setRows] = useState([]);
  const [draft, setDraft] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [submitState, setSubmitState] = useState({ type: "", message: "" });
  const [timeFilter, setTimeFilter] = useState("all");
  const [modeFilter, setModeFilter] = useState("all");
  const [sortFilter, setSortFilter] = useState("trending");
  const [showAllQuickPicks, setShowAllQuickPicks] = useState(false);
  const [actionFeedback, setActionFeedback] = useState("");
  const [hoverInfo, setHoverInfo] = useState(null);
  const timeOptions = TIME_OPTIONS.map((option) => ({
    value: option.value,
    label: option.labels[language],
  }));
  const modeOptions = MODE_OPTIONS.map((option) => ({
    value: option.value,
    label: option.labels[language],
  }));
  const sortOptions = SORT_OPTIONS.map((option) => ({
    value: option.value,
    label: option.labels[language],
  }));

  const refreshMessages = useCallback(async ({ silent = false } = {}) => {
    if (!silent) {
      setIsLoading(true);
    }

    const { data, error: queryError } = await supabase
      .from("feedback_messages")
      .select("text, created_at")
      .order("created_at", { ascending: false })
      .limit(5000);

    if (queryError) {
      setFetchError(copy.loadingFailed(queryError.message));
      if (!silent) {
        setIsLoading(false);
      }
      return;
    }

    setFetchError("");
    setRows(data || []);

    if (!silent) {
      setIsLoading(false);
    }
  }, [copy]);

  useEffect(() => {
    refreshMessages();

    const timer = window.setInterval(() => {
      refreshMessages({ silent: true });
    }, POLL_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [refreshMessages]);

  const filteredRows = useMemo(() => {
    const windowMs = getRangeWindowMs(timeFilter);
    const cutoff = windowMs ? Date.now() - windowMs : 0;

    return rows.filter((row) => {
      const ts = parseTimestamp(row.created_at);
      if (windowMs && ts < cutoff) {
        return false;
      }

      if (modeFilter !== "all" && classifySentiment(row.text || "") !== modeFilter) {
        return false;
      }

      return true;
    });
  }, [rows, timeFilter, modeFilter]);

  const entries = useMemo(() => {
    const aggregated = aggregateFeedback(filteredRows);
    return sortEntries(aggregated, sortFilter);
  }, [filteredRows, sortFilter]);

  const heartWords = useMemo(() => {
    return computeHeartLayout(entries, HEART_WIDTH, HEART_HEIGHT);
  }, [entries]);

  const totalMessages = filteredRows.length;

  const visibleQuickPicks = useMemo(() => {
    if (showAllQuickPicks) {
      return QUICK_PICKS;
    }
    return QUICK_PICKS.slice(0, DEFAULT_QUICK_PICK_COUNT);
  }, [showAllQuickPicks]);

  useEffect(() => {
    if (!actionFeedback) return undefined;
    const timer = window.setTimeout(() => setActionFeedback(""), 2400);
    return () => window.clearTimeout(timer);
  }, [actionFeedback]);

  useEffect(() => {
    setHoverInfo(null);
  }, [timeFilter, modeFilter, sortFilter]);

  useEffect(() => {
    if (!hoverInfo) {
      return;
    }

    const stillVisible = heartWords.some((word) => word.text === hoverInfo.text);
    if (!stillVisible) {
      setHoverInfo(null);
    }
  }, [heartWords, hoverInfo]);

  const sendMessage = useCallback(
    async (message, { clearInput = true } = {}) => {
      const normalized = normalizeMessage(message);
      if (!normalized) {
        setSubmitState({ type: "error", message: copy.emptyMessage });
        return false;
      }

      if (normalized.length > MAX_MESSAGE_LENGTH) {
        setSubmitState({
          type: "error",
          message: copy.messageTooLong(MAX_MESSAGE_LENGTH),
        });
        return false;
      }

      setIsSending(true);
      setSubmitState({ type: "", message: "" });

      try {
        const { error: insertError } = await supabase.from("feedback_messages").insert({
          text: normalized,
        });

        if (insertError) {
          setSubmitState({
            type: "error",
            message: copy.sendFailed(insertError.message),
          });
          return false;
        }

        if (clearInput) {
          setDraft("");
        }

        setSubmitState({
          type: "success",
          message: copy.successMessage,
        });
        await refreshMessages({ silent: true });
        return true;
      } finally {
        setIsSending(false);
      }
    },
    [copy, refreshMessages]
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    await sendMessage(draft);
  };

  const handleQuickSend = async (message) => {
    if (isSending) return;
    await sendMessage(message, { clearInput: false });
  };

  const handleDownloadSnapshot = useCallback(() => {
    if (!entries.length) {
      setActionFeedback(copy.noDataToDownload);
      return;
    }

    const lines = ["word,count,last_seen"];
    entries.forEach((entry) => {
      lines.push(
        `${toCsvCell(entry.text)},${toCsvCell(entry.count)},${toCsvCell(entry.latestAt || "")}`
      );
    });

    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `feedback-cloud-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setActionFeedback(copy.csvDownloaded);
  }, [copy, entries]);

  const handleShareSnapshot = useCallback(async () => {
    const headline = copy.shareTitle;
    const topWords = entries
      .slice(0, 8)
      .map((entry) => `${getLocalizedFeedbackText(entry.text, language)} (${entry.count})`)
      .join(", ");
    const selectedTimeLabel =
      timeOptions.find((option) => option.value === timeFilter)?.label || timeFilter;
    const selectedModeLabel =
      modeOptions.find((option) => option.value === modeFilter)?.label || modeFilter;
    const selectedSortLabel =
      sortOptions.find((option) => option.value === sortFilter)?.label || sortFilter;
    const summary = copy.shareSummary({
      timeLabel: selectedTimeLabel,
      modeLabel: selectedModeLabel,
      sortLabel: selectedSortLabel,
      topWords,
    });

    try {
      if (navigator.share) {
        await navigator.share({ title: headline, text: summary });
        setActionFeedback(copy.shared);
        return;
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(`${headline}\n${summary}`);
        setActionFeedback(copy.copied);
        return;
      }

      setActionFeedback(copy.shareUnsupported);
    } catch {
      setActionFeedback(copy.shareCancelled);
    }
  }, [
    copy,
    entries,
    language,
    modeFilter,
    modeOptions,
    sortFilter,
    sortOptions,
    timeFilter,
    timeOptions,
  ]);

  const handleWordHover = useCallback((event, word) => {
    const stage = cloudStageRef.current;
    if (!stage) return;

    const rect = stage.getBoundingClientRect();
    const rawX = event.clientX - rect.left + 12;
    const rawY = event.clientY - rect.top - 12;
    const tooltipWidth = 220;
    const maxX = Math.max(12, rect.width - tooltipWidth - 12);

    setHoverInfo({
      text: word.text,
      count: word.count,
      latestAt: word.latestAt,
      x: Math.min(Math.max(rawX, 12), maxX),
      y: Math.max(rawY, 16),
    });
  }, []);

  const handleWordLeave = useCallback(() => {
    setHoverInfo(null);
  }, []);

  const activeWord = hoverInfo?.text || "";

  const handleSendAnother = () => {
    setSubmitState({ type: "", message: "" });
    inputRef.current?.focus();
  };

  const handleBackToCloud = () => {
    cloudStageRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <>
      <section className="feedback-hero" style={{ backgroundImage: `url(${cover2Img})` }}>
        <div className="feedback-hero-content">
          <h1 className="feedback-hero-title" data-reveal style={{ "--reveal-delay": "0.05s" }}>
            {copy.heroTitle}
          </h1>
          <p className="feedback-hero-subtitle" data-reveal style={{ "--reveal-delay": "0.12s" }}>
            {copy.heroSubtitle}
          </p>
        </div>
      </section>

      <div className="feedback-page" style={{ backgroundImage: `url(${snowBg})` }}>
        <section className="feedback-panel glass-card" data-reveal>
          <h1 className="feedback-main-title" data-reveal>
            {copy.mainTitle}
          </h1>
          <p className="feedback-main-subtitle" data-reveal style={{ "--reveal-delay": "0.06s" }}>
            {copy.mainSubtitle}
          </p>

          <div className="feedback-cloud-card" data-reveal style={{ "--reveal-delay": "0.08s" }}>
            <div className="feedback-cloud-toolbar" role="toolbar" aria-label={copy.controlsAria}>
              <div className="feedback-tool-group">
                <span className="feedback-tool-label">{copy.timeLabel}</span>
                <div className="feedback-tool-options">
                  {timeOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={`feedback-tool-btn${timeFilter === option.value ? " is-active" : ""}`}
                      onClick={() => setTimeFilter(option.value)}
                      aria-pressed={timeFilter === option.value}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="feedback-tool-group">
                <span className="feedback-tool-label">{copy.modeLabel}</span>
                <div className="feedback-tool-options">
                  {modeOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={`feedback-tool-btn${modeFilter === option.value ? " is-active" : ""}`}
                      onClick={() => setModeFilter(option.value)}
                      aria-pressed={modeFilter === option.value}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="feedback-tool-group">
                <span className="feedback-tool-label">{copy.sortLabel}</span>
                <div className="feedback-tool-options">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={`feedback-tool-btn${sortFilter === option.value ? " is-active" : ""}`}
                      onClick={() => setSortFilter(option.value)}
                      aria-pressed={sortFilter === option.value}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="feedback-tool-group feedback-tool-group--actions">
                <span className="feedback-tool-label">{copy.actionLabel}</span>
                <div className="feedback-tool-options">
                  <button type="button" className="feedback-tool-btn" onClick={handleDownloadSnapshot}>
                    {copy.download}
                  </button>
                  <button type="button" className="feedback-tool-btn" onClick={handleShareSnapshot}>
                    {copy.share}
                  </button>
                </div>
              </div>
            </div>

            <div
              className={`feedback-cloud-stage${activeWord ? " is-word-hovering" : ""}`}
              ref={cloudStageRef}
            >
              {isLoading ? (
                <p className="feedback-state">{copy.loadingMessages}</p>
              ) : heartWords.length === 0 ? (
                <p className="feedback-state">{copy.noMessages}</p>
              ) : (
                <div className="feedback-heart-cloud" role="img" aria-label={copy.wordCloudAria}>
                  {heartWords.map((word) => (
                    <span
                      key={word.text}
                      className={`feedback-word${
                        activeWord ? (activeWord === word.text ? " is-active" : " is-muted") : ""
                      }`}
                      style={{
                        left: `${(word.x / HEART_WIDTH) * 100}%`,
                        top: `${(word.y / HEART_HEIGHT) * 100}%`,
                        fontSize: `${word.fontSize}px`,
                        color: word.color,
                      }}
                      onMouseEnter={(event) => handleWordHover(event, word)}
                      onMouseMove={(event) => handleWordHover(event, word)}
                      onMouseLeave={handleWordLeave}
                    >
                      {getLocalizedFeedbackText(word.text, language)}
                    </span>
                  ))}
                </div>
              )}

              {hoverInfo ? (
                <div
                  className="feedback-word-tooltip"
                  style={{ left: `${hoverInfo.x}px`, top: `${hoverInfo.y}px` }}
                >
                  <p className="feedback-word-tooltip-row">
                    <span>{copy.wordLabel}</span>
                    <strong>{getLocalizedFeedbackText(hoverInfo.text, language)}</strong>
                  </p>
                  <p className="feedback-word-tooltip-row">
                    <span>{copy.countLabel}</span>
                    <strong>{hoverInfo.count}</strong>
                  </p>
                  <p className="feedback-word-tooltip-row">
                    <span>{copy.lastSeenLabel}</span>
                    <strong>{formatTimeAgo(hoverInfo.latestAt, copy)}</strong>
                  </p>
                </div>
              ) : null}
            </div>

            {actionFeedback ? <p className="feedback-tool-feedback">{actionFeedback}</p> : null}
          </div>

          <p className="feedback-meta" data-reveal style={{ "--reveal-delay": "0.11s" }}>
            {copy.messagesMeta(totalMessages, entries.length)}
          </p>

          {fetchError ? <p className="feedback-error">{fetchError}</p> : null}

          <div className="feedback-quick-tags">
            <div className="feedback-quick-header">
              <p className="feedback-quick-title">{copy.quickPicksTitle}</p>
              {QUICK_PICKS.length > DEFAULT_QUICK_PICK_COUNT ? (
                <button
                  type="button"
                  className="feedback-quick-toggle"
                  onClick={() => setShowAllQuickPicks((value) => !value)}
                >
                  {showAllQuickPicks ? copy.showLess : copy.showMore}
                </button>
              ) : null}
            </div>

            <div className="feedback-quick-row">
              {visibleQuickPicks.map((pick) => (
                <button
                  key={`${pick.labels.en}-${pick.labels.zh}`}
                  type="button"
                  className={`feedback-quick-tag feedback-quick-tag--${pick.tone}`}
                  onClick={() => handleQuickSend(pick.labels[language])}
                  disabled={isSending}
                >
                  {pick.labels[language]}
                </button>
              ))}
            </div>
          </div>

          <div className="feedback-submit-module" id="feedback-submit">
            <form className="feedback-dock" onSubmit={handleSubmit}>
              <label htmlFor="feedback-input" className="feedback-sr-only">
                {copy.inputLabel}
              </label>
              <input
                id="feedback-input"
                ref={inputRef}
                type="text"
                value={draft}
                onChange={(event) => {
                  setDraft(event.target.value);
                  if (submitState.type) {
                    setSubmitState({ type: "", message: "" });
                  }
                }}
                placeholder={copy.inputPlaceholder(MAX_MESSAGE_LENGTH)}
                maxLength={MAX_MESSAGE_LENGTH}
                autoComplete="off"
              />
              <button type="submit" disabled={isSending} aria-label={copy.send}>
                {isSending ? copy.sending : copy.send}
              </button>
            </form>

            <div className="feedback-dock-meta">
              <p className="feedback-dock-note">
                {copy.dockNote}
              </p>
              <p className="feedback-dock-counter">
                {draft.length}/{MAX_MESSAGE_LENGTH}
              </p>
            </div>

            {submitState.type === "error" ? <p className="feedback-error">{submitState.message}</p> : null}

            {submitState.type === "success" ? (
              <div className="feedback-submit-confirm">
                <p className="feedback-submit-confirm-title">{submitState.message}</p>
                <p className="feedback-submit-confirm-subtitle">
                  {copy.successSubtitle}
                </p>
                <div className="feedback-submit-links">
                  <button type="button" className="feedback-inline-link" onClick={handleSendAnother}>
                    {copy.sendAnother}
                  </button>
                  <button type="button" className="feedback-inline-link" onClick={handleBackToCloud}>
                    {copy.backToCloud}
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </>
  );
}
