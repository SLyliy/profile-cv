import { useCallback, useEffect, useState } from "react";
import { useScrollReveal } from "../../utils/useScrollReveal";
import "./Project.css";
import img101 from "../../assets/101.png";
import img102 from "../../assets/102.png";
import img103 from "../../assets/103.png";
import img104 from "../../assets/104.png";
import img201 from "../../assets/201.png";
import img202 from "../../assets/202.png";
import img203 from "../../assets/203.png";
import img204 from "../../assets/204.png";
import img301 from "../../assets/301.png";
import img302 from "../../assets/302.png";
import img303 from "../../assets/303.png";
import img304 from "../../assets/304.png";
import img305 from "../../assets/305.png";
import { useLanguage } from "../../i18n/language-context";

const PROJECT_IMAGE_SETS = [
  [
    {
      src: img101,
      alt: {
        en: "Project 01 screenshot 1",
        zh: "项目 01 截图 1",
      },
    },
    {
      src: img102,
      alt: {
        en: "Project 01 screenshot 2",
        zh: "项目 01 截图 2",
      },
    },
    {
      src: img103,
      alt: {
        en: "Project 01 screenshot 3",
        zh: "项目 01 截图 3",
      },
    },
    {
      src: img104,
      alt: {
        en: "Project 01 screenshot 4",
        zh: "项目 01 截图 4",
      },
    },
  ],
  [
    {
      src: img201,
      alt: {
        en: "Project 02 screenshot 1",
        zh: "项目 02 截图 1",
      },
    },
    {
      src: img202,
      alt: {
        en: "Project 02 screenshot 2",
        zh: "项目 02 截图 2",
      },
    },
    {
      src: img203,
      alt: {
        en: "Project 02 screenshot 3",
        zh: "项目 02 截图 3",
      },
    },
    {
      src: img204,
      alt: {
        en: "Project 02 screenshot 4",
        zh: "项目 02 截图 4",
      },
    },
  ],
  [
    {
      src: img301,
      alt: { en: "Project 03 screenshot 1", zh: "项目 03 截图 1" },
    },
    // {
    //   src: img302,
    //   alt: { en: "Project 03 screenshot 2", zh: "项目 03 截图 2" },
    // },
    {
      src: img303,
      alt: { en: "Project 03 screenshot 3", zh: "项目 03 截图 3" },
    },
    {
      src: img304,
      alt: { en: "Project 03 screenshot 4", zh: "项目 03 截图 4" },
    },
    {
      src: img305,
      alt: { en: "Project 03 screenshot 5", zh: "项目 03 截图 5" },
    },
  ],
];

const PROJECT_COPY = {
  en: {
    heroTitle: "My Projects",
    heroSubtitle: "A collection of my recent work and side projects",
    openLive: "Open live project",
    openSource: "Open source repository",
    showPrevious: "Show previous screenshot",
    switchScreenshot: "Switch screenshot",
    items: [
      {
        title: "SafeGuard Market Analytics",
        description:
          "Multi-asset analytics platform covering crypto, stocks, forex, and futures. Features real-time quotes, sentiment overview, whale tracking, and AI Q&A with subscription billing.",
        stack: "React, Vite, TailwindCSS, FastAPI, JWT, TimescaleDB, Recharts, Docker",
        liveUrl: "",
        repoUrl: "https://github.com/SLyliy/Financial-Investment-Assistant.git",
      },
      {
        title: "Interview System",
        description:
          "Web-based interview question bank and practice platform with teacher-admin and student interfaces. Supports tag management, difficulty categorisation, comment threads, favourites, and scoring stats.",
        stack: "React, Vite, Express, JWT, PostgreSQL",
        liveUrl: "",
        repoUrl: "https://github.com/SLyliy/rbtree-interview-system.git",
      },
      {
        title: "RentalRights",
        description:
          "UI design prototype for a rental rights support platform, with legal guidance, AI chat help, knowledge resources, human support, and case management tools.",
        stack: "Figma, Wireframing, Prototyping, UI/UX Design, User Flow Design",
        liveUrl: "https://www.figma.com/design/vwckIdQZ48Ii7247rRvVru/rentalrights?node-id=6-2&p=f&t=TOQXKrdPjflp6Tnb-0",
        repoUrl: "",
      },
    ],
  },
  zh: {
    heroTitle: "我的项目",
    heroSubtitle: "近期作品与个人项目整理",
    openLive: "打开线上项目",
    openSource: "打开源码仓库",
    showPrevious: "查看上一张截图",
    switchScreenshot: "切换截图",
    items: [
      {
        title: "SafeGuard Market Analytics",
        description:
          "多资产分析平台，覆盖加密货币/股票/外汇/期货，提供实时行情、情绪概览、鲸鱼追踪及 AI 问答，支持订阅付费与多端适配。",
        stack: "React, Vite, TailwindCSS, FastAPI, JWT, TimescaleDB, Recharts, Docker",
        liveUrl: "",
        repoUrl: "https://github.com/SLyliy/Financial-Investment-Assistant.git",
      },
      {
        title: "Interview System",
        description:
          "Web 面试题库与练习平台，区分教师管理端与学生刷题端，支持题目与标签体系维护、难度分类、评论讨论区、收藏夹与错题本、刷题进度与得分统计。",
        stack: "React, Vite, Express, JWT, PostgreSQL",
        liveUrl: "",
        repoUrl: "https://github.com/SLyliy/rbtree-interview-system.git",
      },
      {
        title: "RentalRights",
        description:
          "租房权益支持平台的 UI 设计原型，涵盖法律指引、AI 智能问答、知识资源库、人工支持及案件管理工具。",
        stack: "Figma, Wireframing, Prototyping, UI/UX Design, User Flow Design",
        liveUrl: "https://www.figma.com/design/vwckIdQZ48Ii7247rRvVru/rentalrights?node-id=6-2&p=f&t=TOQXKrdPjflp6Tnb-0",
        repoUrl: "",
      },
    ],
  },
};

function ExternalIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 17 17 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M10 7h7v7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 6.5v11l8-5.5-8-5.5Z" fill="currentColor" />
    </svg>
  );
}

const SLIDE_DURATION_MS = 760;

function useAutoSlidingCarousel(total, intervalMs) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transition, setTransition] = useState({
    prevIndex: 0,
    direction: 1,
    isAnimating: false,
  });

  const move = useCallback(
    (direction) => {
      setCurrentIndex((current) => {
        const nextIndex =
          direction > 0 ? (current + 1) % total : (current - 1 + total) % total;

        setTransition({
          prevIndex: current,
          direction,
          isAnimating: true,
        });

        return nextIndex;
      });
    },
    [total]
  );

  const prev = useCallback(() => move(-1), [move]);
  const next = useCallback(() => move(1), [move]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      next();
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [intervalMs, next]);

  useEffect(() => {
    if (!transition.isAnimating) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setTransition((state) => ({ ...state, isAnimating: false }));
    }, SLIDE_DURATION_MS);

    return () => window.clearTimeout(timer);
  }, [transition.isAnimating]);

  return {
    currentIndex,
    prevIndex: (currentIndex - 1 + total) % total,
    transition,
    prev,
    next,
  };
}

export default function Project() {
  useScrollReveal();

  const { language } = useLanguage();
  const copy = PROJECT_COPY[language];

  const project01Carousel = useAutoSlidingCarousel(PROJECT_IMAGE_SETS[0].length, 5600);
  const project02Carousel = useAutoSlidingCarousel(PROJECT_IMAGE_SETS[1].length, 6200);
  const project03Carousel = useAutoSlidingCarousel(PROJECT_IMAGE_SETS[2].length, 6800);

  const carousels = [project01Carousel, project02Carousel, project03Carousel];

  return (
    <>
      <div className="project-page">
        {copy.items.map((item, index) => {
          const carousel = carousels[index];
          const images = PROJECT_IMAGE_SETS[index];
          const {
            currentIndex,
            prevIndex,
            transition,
            prev: showPrev,
            next: showNext,
          } = carousel;

          return (
            <section
              key={`${item.title}-${index}`}
              className={`project-module ${index === 1 ? "project-module--right" : "project-module--left"}`}
              aria-labelledby={`project0${index + 1}-title`}
            >
              <div className="project-module-content">
                <article className="project01-info" data-reveal>
                  <p className="project01-number" data-reveal style={{ "--reveal-delay": "0.03s" }}>
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h1
                    className="project01-title"
                    id={`project0${index + 1}-title`}
                    data-reveal
                    style={{ "--reveal-delay": "0.08s" }}
                  >
                    {item.title}
                  </h1>
                  <p className="project01-desc" data-reveal style={{ "--reveal-delay": "0.12s" }}>
                    {item.description}
                  </p>
                  <p className="project01-stack" data-reveal style={{ "--reveal-delay": "0.16s" }}>
                    {item.stack}
                  </p>

                  <div className="project01-divider" data-reveal style={{ "--reveal-delay": "0.2s" }} />

                  <div className="project01-actions" data-reveal style={{ "--reveal-delay": "0.24s" }}>
                    {item.liveUrl ? (
                      <a href={item.liveUrl} target="_blank" rel="noopener noreferrer" className="project01-action-btn" aria-label={copy.openLive}>
                        <ExternalIcon />
                      </a>
                    ) : (
                      <button type="button" className="project01-action-btn" aria-label={copy.openLive} disabled style={{ opacity: 0.35, cursor: "not-allowed" }}>
                        <ExternalIcon />
                      </button>
                    )}
                    {item.repoUrl ? (
                      <a href={item.repoUrl} target="_blank" rel="noopener noreferrer" className="project01-action-btn" aria-label={copy.openSource}>
                        <GithubIcon />
                      </a>
                    ) : (
                      <button type="button" className="project01-action-btn" aria-label={copy.openSource}>
                        <GithubIcon />
                      </button>
                    )}
                  </div>
                </article>

                <article className="project01-visual" data-reveal style={{ "--reveal-delay": "0.1s" }}>
                  <div className="project01-gallery-stage">
                    <button
                      type="button"
                      className="project01-side-preview"
                      onClick={showPrev}
                      aria-label={copy.showPrevious}
                    >
                      <img
                        key={`project0${index + 1}-prev-${prevIndex}`}
                        src={images[prevIndex].src}
                        alt={images[prevIndex].alt[language]}
                        className="project01-side-image"
                      />
                    </button>

                    <button
                      type="button"
                      className="project01-float-switch"
                      onClick={showNext}
                      aria-label={copy.switchScreenshot}
                    >
                      <PlayIcon />
                    </button>

                    <figure className="project01-main-frame">
                      {transition.isAnimating ? (
                        <>
                          <img
                            src={images[transition.prevIndex].src}
                            alt={images[transition.prevIndex].alt[language]}
                            className={`project01-main-image project01-main-image--layer ${
                              transition.direction > 0
                                ? "project01-main-image--out-left"
                                : "project01-main-image--out-right"
                            }`}
                          />
                          <img
                            src={images[currentIndex].src}
                            alt={images[currentIndex].alt[language]}
                            className={`project01-main-image project01-main-image--layer ${
                              transition.direction > 0
                                ? "project01-main-image--in-right"
                                : "project01-main-image--in-left"
                            }`}
                          />
                        </>
                      ) : (
                        <img
                          src={images[currentIndex].src}
                          alt={images[currentIndex].alt[language]}
                          className="project01-main-image project01-main-image--single"
                        />
                      )}
                    </figure>
                  </div>

                  <div className="project01-gallery-footer">
                    <div className="project01-gallery-count">
                      {String(currentIndex + 1).padStart(2, "0")} /{" "}
                      {String(images.length).padStart(2, "0")}
                    </div>
                  </div>
                </article>
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
