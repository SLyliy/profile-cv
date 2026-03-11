// 顶部导航栏（品牌区 + 锚点导航），点击时平滑滚动到页面各 section
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import './Navbar.css';
import { scrollToSection } from '../../utils/scrollToSection';
import { useLanguage } from "../../i18n/language-context";
import logoImg from "../../assets/logo.jpg";

const NAVBAR_COPY = {
  en: {
    brandTitle: "Ly Studio",
    brandSubtitle: "Design & Development",
    home: "Home",
    project: "Project",
    feedback: "Feedback",
    contact: "Contact",
    switchLabel: "中文",
    switchAria: "Switch the website to Simplified Chinese",
  },
  zh: {
    brandTitle: "Ly Studio",
    brandSubtitle: "设计 & 开发",
    home: "首页",
    project: "项目",
    feedback: "反馈",
    contact: "联系",
    switchLabel: "EN",
    switchAria: "切换网站为英文",
  },
};

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { language, toggleLanguage } = useLanguage();
  const isHome = location.pathname === "/home";
  const activeHash = location.hash;
  const copy = NAVBAR_COPY[language];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const onNav = (id) => (e) => {
    e.preventDefault();
    if (location.pathname !== "/home") {
      if (id === "home") {
        navigate("/home");
      } else {
        navigate(`/home#${id}`);
      }
      return;
    }
    scrollToSection(id);
    if (id === "home") {
      navigate("/home", { replace: true });
    } else {
      navigate(`/home#${id}`, { replace: true });
    }
  };

  const onCover = () => {
    navigate("/");
  };

  const onContact = (e) => {
    e.preventDefault();
    if (location.pathname !== "/contact") {
      navigate("/contact");
    }
  };

  const onProject = (e) => {
    e.preventDefault();
    if (location.pathname !== "/project") {
      navigate("/project");
    }
  };

  const onFeedback = (e) => {
    e.preventDefault();
    if (location.pathname !== "/feedback") {
      navigate("/feedback");
    }
  };

  return (
    <header className={`topbar ${isScrolled ? 'scrolled' : ''}`}>
      <button className="brand brand-link" type="button" onClick={onCover}>
        <img className="brand-badge" src={logoImg} alt="Ly Studio logo" aria-hidden="true" />
        <div>
          {copy.brandTitle}
          <small>{copy.brandSubtitle}</small>
        </div>
      </button>

      <div className="topbar-actions">
        <nav>
          <a
            className={isHome && (!activeHash || activeHash === "#home") ? "active" : ""}
            href="/home"
            onClick={onNav('home')}
          >
            {copy.home}
          </a>
          <a
            className={location.pathname === "/project" ? "active" : ""}
            href="/project"
            onClick={onProject}
          >
            {copy.project}
          </a>
          <a
            className={location.pathname === "/feedback" ? "active" : ""}
            href="/feedback"
            onClick={onFeedback}
          >
            {copy.feedback}
          </a>
          <a
            className={location.pathname === "/contact" ? "active" : ""}
            href="/contact"
            onClick={onContact}
          >
            {copy.contact}
          </a>
        </nav>

        <button
          type="button"
          className="lang-toggle"
          onClick={toggleLanguage}
          aria-label={copy.switchAria}
        >
          {copy.switchLabel}
        </button>
      </div>
    </header>
  );
}
