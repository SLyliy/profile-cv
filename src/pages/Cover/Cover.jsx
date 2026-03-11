import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useScrollReveal } from "../../utils/useScrollReveal";
import coverImg from "../../assets/Cover_4.JPG";
import CoverRipple from "./CoverRipple";
import "./Cover.css";
import { useLanguage } from "../../i18n/language-context";

const COVER_COPY = {
  en: {
    subtitle: "Build clean UI. Ship thoughtful experiences.",
    explore: "Explore",
  },
  zh: {
    subtitle: "打造干净的 UI，交付有思考的体验。",
    explore: "进入主页",
  },
};

export default function Cover() {
  const navigate = useNavigate();
  useScrollReveal();
  const { language } = useLanguage();
  const copy = COVER_COPY[language];

  const rippleRef = useRef(null);
  const navTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (navTimeoutRef.current) clearTimeout(navTimeoutRef.current);
    };
  }, []);

  const onBackgroundClick = (e) => {
    if (e.target.closest(".cover-btn")) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width;  // 0~1
    const ny = (e.clientY - rect.top) / rect.height;  // 0~1

    rippleRef.current?.addRipple(nx, ny);
  };

  const onExplore = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      navigate("/home");
      return;
    }

    // 中心来一下更“大片感”的水波
    rippleRef.current?.addRipple(0.5, 0.42);

    if (navTimeoutRef.current) clearTimeout(navTimeoutRef.current);
    navTimeoutRef.current = setTimeout(() => {
      navigate("/home");
    }, 700);
  };

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <section className="cover-hero" onClick={onBackgroundClick} style={{ cursor: "pointer" }}>
      {/* 真实水波背景（canvas里渲染封面图） */}
      <CoverRipple ref={rippleRef} imageSrc={coverImg} disabled={prefersReducedMotion} />

      <div className="cover-content" data-reveal>
        <h1 className="cover-title">Xiang Li</h1>
        <p className="cover-subtitle">{copy.subtitle}</p>
        <a className="cover-btn" href="/home" onClick={onExplore}>
          {copy.explore}
        </a>
      </div>
    </section>
  );
}
