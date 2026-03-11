import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import backgroundImg from "../../assets/background.jpg";
import { useScrollReveal } from "../../utils/useScrollReveal";
import { scrollToSection } from "../../utils/scrollToSection";
import { useLanguage } from "../../i18n/language-context";

const HOME_COPY = {
  en: {
    taglines: [
      "Computer Science Undergraduate",
      "Front-end Development Focus",
      "UI & UX Enthusiast",
    ],
    greeting: "Hello, I'm",
    lead:
      "I build clean and modern web interfaces with a strong focus on readability and user experience. I like design systems, consistent spacing, and UI details that feel calm and polished. I’m currently preparing for internship opportunities where I can contribute to real products and learn quickly.",
    viewProjects: "View Projects",
    contactMe: "Contact Me",
    profileAria: "Profile card",
    profileTitle: "Xiang Li • CS Student",
    profileLine1: "Based in Sydney • Enjoys building modern UI",
    profileLine2: "Exploring internship opportunities",
    recentHighlights: "Recent Highlights",
    highlights: [
      {
        title: "Learning Progress",
        description:
          "Solid fundamentals across core CS topics and practical web development. I like learning with small deliverables: build -> review -> refine.",
      },
      {
        title: "Hands-on Projects",
        description:
          "Comfortable building responsive pages, component layouts, and clean UI patterns. I focus on neat structure and readable code.",
      },
      {
        title: "Collaboration",
        description:
          "Enjoys teamwork, quick check-ins, and clear documentation. I value calm communication and steady delivery.",
      },
    ],
    aboutDetails: "About Details",
    educationTitle: "Education Background",
    education: [
      {
        degree:
          "Master of Computer Science & Technology — University of New South Wales (QS Top 20)",
        date: "Feb 2024 – Dec 2025",
        location: "Sydney, Australia",
      },
      {
        degree:
          "Bachelor of Finance (Full English-taught) — Huaqiao University",
        date: "Sep 2019 – Jun 2023",
        location: "China",
      },
    ],
    internships: [
      {
        title: "Internship Experience – TEKNOAUS Company",
        bullets: [
          "Built core pages for a financial analytics platform using React + Vite with Tailwind CSS, supporting 5,000+ daily active users with page load times under 1.5s.",
          "Encapsulated a unified data layer handling auth, error boundaries, and loading states; integrated Recharts for interactive price and sentiment charts, reducing repeated code by 40%.",
          "Implemented subscription and checkout flow with Stripe/PayPal integration and wrote 8 Cypress end-to-end tests covering key user journeys.",
        ],
      },
      {
        title: "Internship Experience – RedBlackTree Company",
        bullets: [
          "Set up the front-end architecture for an education platform using React + Vite, configured ESLint and build scripts, and established 20+ reusable global components, cutting duplicated code by 50%.",
          "Implemented user registration, login, and token-based auth with admin role control; built user management CRUD and paginated APIs with a PostgreSQL schema.",
          "Designed a multi-condition question bank search with comment tree updates, improving query performance by 30%.",
        ],
      },
    ],
    skillsTitle: "Skills & Tools",
    skills: [
      {
        name: "Front-end Basics",
        percentage: "85%",
        description:
          "HTML5, CSS3, JavaScript, responsive layouts, clean UI spacing.",
      },
      {
        name: "Frameworks & Styling",
        percentage: "75%",
        description:
          "React (learning), Vue basics, Sass, component-based design.",
      },
      {
        name: "Backend & Databases",
        percentage: "70%",
        description:
          "Node.js basics, REST concepts, SQL fundamentals, schema reading.",
      },
      {
        name: "Workflow & Tools",
        percentage: "80%",
        description:
          "Git, VS Code, Figma, debugging habits, readable documentation.",
      },
    ],
    projectExperience: "Project Experience",
    projects: [
      {
        title:
          "Multi-Asset Investment Analysis Platform · Full-Stack · Sep – Dec 2025",
        bullets: [
          "Full-stack multi-asset analytics platform (crypto/stocks/forex/futures) with real-time quotes, sentiment overview, whale tracking, and AI Q&A.",
          "React + Vite + Tailwind CSS / FastAPI + JWT + TimescaleDB + Recharts + Docker Compose.",
          "Stripe/PayPal subscription billing with unified token injection, LLM-based asset summaries, and 401 handling across all protected routes.",
        ],
      },
      {
        title:
          "Online Question Bank & Learning System · Front-End · Aug – Oct 2025",
        bullets: [
          "Web question-bank platform with teacher-admin and student interfaces; tag management, difficulty categorisation, comment threads, favourites, and scoring stats.",
          "PostgreSQL + multi-condition search (tag/difficulty/keyword); Express + JWT APIs; React + Vite front end linking question list, answer, and discussion pages.",
          "20+ reusable global components with unified ESLint + build-script setup, cutting duplicated code by 50%.",
        ],
      },
      {
        title:
          "User Visit History Tracking & Visualisation Platform · Back-End · Feb – Apr 2025",
        bullets: [
          "Country visit history tracking service: import by country code, auto-fetch details from external GraphQL, CRUD APIs, and statistics chart generation.",
          "Flask + Flask-RESTx RESTful APIs; SQLite storage; GraphQL metadata seeding via requests; Matplotlib PNG chart output with filtering and pagination.",
          "Clean separation of routes, services, and models for easy extension with new data sources or visualisation endpoints.",
        ],
      },
    ],
  },
  zh: {
    taglines: ["计算机专业在读", "专注前端开发", "热爱 UI 与 UX"],
    greeting: "你好，我是",
    lead:
      "我专注于构建干净、现代的网页界面，尤其看重可读性与用户体验。我喜欢设计系统、一致的间距节奏，以及克制但精致的 UI 细节。目前我正在积极准备实习，希望能参与真实产品的构建，并在实践中快速成长。",
    viewProjects: "查看项目",
    contactMe: "联系我",
    profileAria: "个人资料卡片",
    profileTitle: "Xiang Li • 计算机学生",
    profileLine1: "常驻 Sydney • 喜欢构建现代 UI",
    profileLine2: "正在寻找实习机会",
    recentHighlights: "近期亮点",
    highlights: [
      {
        title: "学习进展",
        description:
          "具备扎实的核心计算机基础与实际 Web 开发能力。我喜欢通过小步交付来学习：构建 -> 复盘 -> 优化。",
      },
      {
        title: "项目实践",
        description:
          "能够独立完成响应式页面、组件布局与整洁的 UI 模式实现，持续关注结构清晰和代码可读性。",
      },
      {
        title: "协作方式",
        description:
          "喜欢团队协作、快速同步与清晰文档。我重视平稳的沟通方式和稳定的交付节奏。",
      },
    ],
    aboutDetails: "详细介绍",
    educationTitle: "教育背景",
    education: [
      {
        degree:
          "计算机科学与技术硕士 — University of New South Wales (QS Top 20)",
        date: "Feb 2024 – Dec 2025",
        location: "Sydney, Australia",
      },
      {
        degree: "金融学学士（全英文授课）— Huaqiao University",
        date: "Sep 2019 – Jun 2023",
        location: "China",
      },
    ],
    internships: [
      {
        title: "实习经历 – TEKNOAUS Company",
        bullets: [
          "使用 React + Vite 与 Tailwind CSS 为金融分析平台搭建核心页面，支持 5,000+ 日活用户，页面加载时间控制在 1.5 秒以内。",
          "封装统一数据层，处理鉴权、错误边界与加载状态；接入 Recharts 实现交互式价格与情绪图表，重复代码减少 40%。",
          "完成 Stripe/PayPal 订阅与支付流程，并编写 8 个 Cypress 端到端测试覆盖关键用户路径。",
        ],
      },
      {
        title: "实习经历 – RedBlackTree Company",
        bullets: [
          "为教育平台搭建 React + Vite 前端架构，配置 ESLint 与构建脚本，沉淀 20+ 个可复用全局组件，重复代码减少 50%。",
          "实现用户注册、登录、基于 token 的鉴权与管理员权限控制，并完成基于 PostgreSQL 的用户管理 CRUD 与分页接口。",
          "设计多条件题库检索与评论树更新方案，查询性能提升 30%。",
        ],
      },
    ],
    skillsTitle: "技能与工具",
    skills: [
      {
        name: "前端基础",
        percentage: "85%",
        description: "HTML5、CSS3、JavaScript、响应式布局、整洁的 UI 间距。",
      },
      {
        name: "框架与样式",
        percentage: "75%",
        description: "React（学习中）、Vue 基础、Sass、组件化设计。",
      },
      {
        name: "后端与数据库",
        percentage: "70%",
        description: "Node.js 基础、REST 概念、SQL 基础、Schema 阅读能力。",
      },
      {
        name: "工作流与工具",
        percentage: "80%",
        description: "Git、VS Code、Figma、调试习惯、清晰文档。",
      },
    ],
    projectExperience: "项目经历",
    projects: [
      {
        title:
          "Multi-Asset Investment Analysis Platform · 全栈 · Sep – Dec 2025",
        bullets: [
          "多资产全栈分析平台（crypto/stocks/forex/futures），包含实时行情、情绪概览、whale tracking 与 AI 问答能力。",
          "技术栈为 React + Vite + Tailwind CSS / FastAPI + JWT + TimescaleDB + Recharts + Docker Compose。",
          "实现 Stripe/PayPal 订阅计费、统一 token 注入、基于 LLM 的资产摘要，以及所有受保护路由的 401 统一处理。",
        ],
      },
      {
        title:
          "Online Question Bank & Learning System · 前端 · Aug – Oct 2025",
        bullets: [
          "面向教师管理员与学生的在线题库平台，覆盖标签管理、难度分类、评论讨论、收藏与成绩统计等功能。",
          "基于 PostgreSQL 的多条件检索（标签/难度/关键词），通过 Express + JWT 提供接口，并使用 React + Vite 串联题目列表、答题与讨论页面。",
          "沉淀 20+ 个可复用全局组件，并统一 ESLint 与构建脚本，重复代码减少 50%。",
        ],
      },
      {
        title:
          "User Visit History Tracking & Visualisation Platform · 后端 · Feb – Apr 2025",
        bullets: [
          "国家访问历史跟踪服务：支持按国家代码导入、从外部 GraphQL 自动获取详情、提供 CRUD 接口并生成统计图表。",
          "采用 Flask + Flask-RESTx RESTful API、SQLite 存储、requests 拉取 GraphQL 元数据，以及 Matplotlib 输出可筛选分页的 PNG 图表。",
          "将 routes、services 与 models 清晰分层，便于后续接入新的数据源和可视化端点。",
        ],
      },
    ],
  },
};

export default function Home() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const copy = HOME_COPY[language];

  useEffect(() => {
    const { hash } = window.location;
    if (hash) {
      scrollToSection(hash.replace("#", ""));
      return;
    }
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);
  useScrollReveal();

  const onContact = (event) => {
    event.preventDefault();
    navigate("/contact");
  };

  return (
    <>
      <section
        className="hero"
        id="home"
        style={{ backgroundImage: `url(${backgroundImg})` }}
      >
        <div>
          <div
            className="tagline"
            data-reveal
            style={{ "--reveal-delay": "0.05s" }}
          >
            {copy.taglines.map((tagline) => (
              <span key={tagline} className="pill">
                {tagline}
              </span>
            ))}
          </div>

          <h1 data-reveal style={{ "--reveal-delay": "0.12s" }}>
            {copy.greeting}{" "}
            <span className="nameGradient">Xiang Li</span>
          </h1>

          <p className="lead" data-reveal style={{ "--reveal-delay": "0.18s" }}>
            {copy.lead}
          </p>

          <div className="cta" data-reveal style={{ "--reveal-delay": "0.26s" }}>
            <a
              className="btn btn-ghost"
              href="/project"
              onClick={(event) => {
                event.preventDefault();
                navigate("/project");
              }}
            >
              <svg
                className="btn-icon btn-icon--arrow"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M5 12h14"
                  stroke="rgba(31,35,64,.75)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M13 6l6 6-6 6"
                  stroke="rgba(31,35,64,.75)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {copy.viewProjects}
            </a>

            <a className="btn btn-ghost" href="/contact" onClick={onContact}>
              <svg className="btn-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v9A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-9Z"
                  stroke="rgba(31,35,64,.75)"
                  strokeWidth="2"
                />
                <path
                  d="m6.5 8 5.5 4 5.5-4"
                  stroke="rgba(31,35,64,.75)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {copy.contactMe}
            </a>

            <a
              className="btn btn-icon-only"
              href="https://github.com/SLyliy"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile"
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"
                  stroke="rgba(31,35,64,.75)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>

        <aside
          className="profile-card"
          aria-label={copy.profileAria}
          data-reveal
          style={{ "--reveal-delay": "0.22s" }}
        >
          <div className="avatar" aria-hidden="true">
            <svg viewBox="0 0 128 128" fill="none">
              <circle cx="64" cy="52" r="22" fill="rgba(255,255,255,.85)" />
              <path d="M28 112c6-22 22-34 36-34s30 12 36 34" fill="rgba(255,255,255,.78)" />
              <path
                d="M44 54c3 3 7 5 20 5s17-2 20-5"
                stroke="rgba(31,35,64,.35)"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle cx="54" cy="50" r="3" fill="rgba(31,35,64,.55)" />
              <circle cx="74" cy="50" r="3" fill="rgba(31,35,64,.55)" />
              <path
                d="M42 46c4-10 13-16 22-16s18 6 22 16"
                stroke="rgba(31,35,64,.25)"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <path
                d="M40 86h48"
                stroke="rgba(31,35,64,.18)"
                strokeWidth="6"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="profile-meta">
            <h3>{copy.profileTitle}</h3>
            <p>
              {copy.profileLine1}
              <br />
              {copy.profileLine2}
            </p>
          </div>
        </aside>
      </section>

      <div className="section-title" data-reveal>
        {copy.recentHighlights}
      </div>

      <section className="cards">
        <article className="card" data-reveal style={{ "--reveal-delay": "0.05s" }}>
          <div className="icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 3 2 8l10 5 10-5-10-5Z" stroke="rgba(107,92,255,.95)" strokeWidth="2" strokeLinejoin="round" />
              <path d="M6 10v5c0 2 12 2 12 0v-5" stroke="rgba(107,92,255,.65)" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <h4>{copy.highlights[0].title}</h4>
          <p>{copy.highlights[0].description}</p>
        </article>

        <article className="card" data-reveal style={{ "--reveal-delay": "0.12s" }}>
          <div className="icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M9 18 3 12l6-6" stroke="rgba(76,195,255,.95)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M15 6l6 6-6 6" stroke="rgba(76,195,255,.95)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M14 4 10 20" stroke="rgba(31,35,64,.28)" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <h4>{copy.highlights[1].title}</h4>
          <p>{copy.highlights[1].description}</p>
        </article>

        <article className="card" data-reveal style={{ "--reveal-delay": "0.18s" }}>
          <div className="icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M16 11a3 3 0 1 0-3-3 3 3 0 0 0 3 3Z" stroke="rgba(255,122,182,.95)" strokeWidth="2" />
              <path d="M8 11a3 3 0 1 0-3-3 3 3 0 0 0 3 3Z" stroke="rgba(255,122,182,.95)" strokeWidth="2" />
              <path d="M3 20c.8-3.6 3.1-5 5-5" stroke="rgba(31,35,64,.28)" strokeWidth="2" strokeLinecap="round" />
              <path d="M21 20c-.8-3.6-3.1-5-5-5" stroke="rgba(31,35,64,.28)" strokeWidth="2" strokeLinecap="round" />
              <path d="M7.5 20c1-4.2 3.8-6 4.5-6s3.5 1.8 4.5 6" stroke="rgba(31,35,64,.28)" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <h4>{copy.highlights[2].title}</h4>
          <p>{copy.highlights[2].description}</p>
        </article>
      </section>

      <div className="section-title" id="about" data-reveal>
        {copy.aboutDetails}
      </div>

      <section className="section-wrap" id="about-details">
        <div className="panel">
          <div className="panel-inner">
            <div className="block" data-reveal>
              <h3>
                <span className="mini-ico" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M12 3 2 8l10 5 10-5-10-5Z" stroke="rgba(107,92,255,.95)" strokeWidth="2" strokeLinejoin="round" />
                    <path d="M6 10v5c0 2 12 2 12 0v-5" stroke="rgba(107,92,255,.65)" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
                {copy.educationTitle}
              </h3>

              <p className="edu-title">{copy.education[0].degree}</p>

              <div className="edu-meta">
                <span>
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M7 3v3M17 3v3M4.5 8h15" stroke="rgba(31,35,64,.55)" strokeWidth="2" strokeLinecap="round" />
                    <path d="M5.5 6h13A2.5 2.5 0 0 1 21 8.5v11A2.5 2.5 0 0 1 18.5 22h-13A2.5 2.5 0 0 1 3 19.5v-11A2.5 2.5 0 0 1 5.5 6Z" stroke="rgba(31,35,64,.40)" strokeWidth="2" />
                  </svg>
                  {copy.education[0].date}
                </span>
                <span>
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M12 21s7-4.4 7-10a7 7 0 1 0-14 0c0 5.6 7 10 7 10Z" stroke="rgba(31,35,64,.40)" strokeWidth="2" strokeLinecap="round" />
                    <path d="M12 11.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" fill="rgba(31,35,64,.28)" />
                  </svg>
                  {copy.education[0].location}
                </span>
              </div>

              <p className="edu-title" style={{ marginTop: "1rem" }}>
                {copy.education[1].degree}
              </p>

              <div className="edu-meta">
                <span>
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M7 3v3M17 3v3M4.5 8h15" stroke="rgba(31,35,64,.55)" strokeWidth="2" strokeLinecap="round" />
                    <path d="M5.5 6h13A2.5 2.5 0 0 1 21 8.5v11A2.5 2.5 0 0 1 18.5 22h-13A2.5 2.5 0 0 1 3 19.5v-11A2.5 2.5 0 0 1 5.5 6Z" stroke="rgba(31,35,64,.40)" strokeWidth="2" />
                  </svg>
                  {copy.education[1].date}
                </span>
                <span>
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M12 21s7-4.4 7-10a7 7 0 1 0-14 0c0 5.6 7 10 7 10Z" stroke="rgba(31,35,64,.40)" strokeWidth="2" strokeLinecap="round" />
                    <path d="M12 11.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" fill="rgba(31,35,64,.28)" />
                  </svg>
                  {copy.education[1].location}
                </span>
              </div>
            </div>

            <div className="block blockTight" data-reveal>
              <h3>
                <span className="mini-ico" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M7 4h10v3a5 5 0 0 1-10 0V4Z" stroke="rgba(76,195,255,.95)" strokeWidth="2" />
                    <path d="M9 20h6" stroke="rgba(31,35,64,.40)" strokeWidth="2" strokeLinecap="round" />
                    <path d="M12 12v8" stroke="rgba(31,35,64,.40)" strokeWidth="2" strokeLinecap="round" />
                    <path d="M7 7H5a2 2 0 0 0 2 2" stroke="rgba(76,195,255,.70)" strokeWidth="2" strokeLinecap="round" />
                    <path d="M17 7h2a2 2 0 0 1-2 2" stroke="rgba(76,195,255,.70)" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
                {copy.internships[0].title}
              </h3>

              <ul className="list">
                {copy.internships[0].bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </div>

            <div className="block blockTight" data-reveal>
              <h3>
                <span className="mini-ico" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M7 4h10v3a5 5 0 0 1-10 0V4Z" stroke="rgba(255,122,182,.95)" strokeWidth="2" />
                    <path d="M9 20h6" stroke="rgba(31,35,64,.40)" strokeWidth="2" strokeLinecap="round" />
                    <path d="M12 12v8" stroke="rgba(31,35,64,.40)" strokeWidth="2" strokeLinecap="round" />
                    <path d="M7 7H5a2 2 0 0 0 2 2" stroke="rgba(255,122,182,.70)" strokeWidth="2" strokeLinecap="round" />
                    <path d="M17 7h2a2 2 0 0 1-2 2" stroke="rgba(255,122,182,.70)" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
                {copy.internships[1].title}
              </h3>

              <ul className="list">
                {copy.internships[1].bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </div>

            <div className="block blockTight" data-reveal>
              <h3>
                <span className="mini-ico" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M12 2 15 5h4v4l3 3-3 3v4h-4l-3 3-3-3H5v-4L2 12l3-3V5h4l3-3Z" stroke="rgba(255,122,182,.90)" strokeWidth="2" strokeLinejoin="round" />
                    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="rgba(31,35,64,.40)" strokeWidth="2" />
                  </svg>
                </span>
                {copy.skillsTitle}
              </h3>

              <div className="skill-grid">
                {copy.skills.map((skill, index) => (
                  <div
                    key={skill.name}
                    className="skill-card"
                    data-reveal
                    style={{ "--reveal-delay": `${0.04 + index * 0.04}s` }}
                  >
                    <div className="skill-top">
                      <div className="skill-name">{skill.name}</div>
                      <div className="skill-pct">{skill.percentage}</div>
                    </div>
                    <p className="skill-desc">{skill.description}</p>
                    <div className="bar">
                      <i style={{ width: skill.percentage }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="section-title" id="projects" data-reveal>
        {copy.projectExperience}
      </div>

      <section className="section-wrap" id="project-experience">
        <div className="panel">
          <div className="panel-inner">
            <div className="block blockTight" data-reveal>
              <h3>
                <span className="mini-ico" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M9 18 3 12l6-6" stroke="rgba(107,92,255,.95)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M15 6l6 6-6 6" stroke="rgba(107,92,255,.95)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M14 4 10 20" stroke="rgba(31,35,64,.28)" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
                {copy.projects[0].title}
              </h3>
              <ul className="list">
                {copy.projects[0].bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </div>

            <div className="block blockTight" data-reveal>
              <h3>
                <span className="mini-ico" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M9 18 3 12l6-6" stroke="rgba(76,195,255,.95)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M15 6l6 6-6 6" stroke="rgba(76,195,255,.95)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M14 4 10 20" stroke="rgba(31,35,64,.28)" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
                {copy.projects[1].title}
              </h3>
              <ul className="list">
                {copy.projects[1].bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </div>

            <div className="block blockTight" data-reveal>
              <h3>
                <span className="mini-ico" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M9 18 3 12l6-6" stroke="rgba(255,122,182,.95)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M15 6l6 6-6 6" stroke="rgba(255,122,182,.95)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M14 4 10 20" stroke="rgba(31,35,64,.28)" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
                {copy.projects[2].title}
              </h3>
              <ul className="list">
                {copy.projects[2].bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
