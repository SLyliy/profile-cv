// 页面底部 Footer（锚点链接 + 社交图标 + 版权信息）
import './Footer.css';
import { useLocation, useNavigate } from "react-router-dom";
import { scrollToSection } from '../../utils/scrollToSection';
import { useLanguage } from "../../i18n/language-context";

const FOOTER_COPY = {
  en: {
    home: "Home",
    about: "About",
    more: "More",
    contact: "Contact",
    socialLinks: "Social links",
    github: "GitHub",
    linkedin: "LinkedIn",
    email: "Email",
    copyright: "© 2026 Mika • Personal profile page • All rights reserved.",
  },
  zh: {
    home: "首页",
    about: "关于",
    more: "更多",
    contact: "联系",
    socialLinks: "社交链接",
    github: "GitHub",
    linkedin: "LinkedIn",
    email: "邮箱",
    copyright: "© 2026 Mika • 个人主页 • 保留所有权利。",
  },
};

export default function Footer() {
  const location = useLocation();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const copy = FOOTER_COPY[language];

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

  const onContact = (e) => {
    e.preventDefault();
    if (location.pathname !== "/contact") {
      navigate("/contact");
    }
  };

  return (
    <footer id="contact">
      <div className="footer-links">
        <a href="/home" onClick={onNav('home')}>{copy.home}</a>
        <a href="/home#about" onClick={onNav('about')}>{copy.about}</a>
        <a href="/home#about-details" onClick={onNav('about-details')}>{copy.more}</a>
        <a href="/contact" onClick={onContact}>{copy.contact}</a>
      </div>

      <div className="social" aria-label={copy.socialLinks}>
        <a href="#" title={copy.github} aria-label={copy.github}>
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M9 19c-4 1.5-4-2-5-2" stroke="rgba(31,35,64,.8)" strokeWidth="2" strokeLinecap="round"/>
            <path d="M15 22v-3.5c0-1 .1-1.8-.5-2.4 2.2-.2 4.5-1.1 4.5-5A3.9 3.9 0 0 0 18 8.3 3.6 3.6 0 0 0 17.9 6s-.9-.3-2.9 1.1a10 10 0 0 0-6 0C7 5.7 6.1 6 6.1 6A3.6 3.6 0 0 0 6 8.3 3.9 3.9 0 0 0 5 11c0 3.9 2.3 4.8 4.5 5-.3.3-.5.8-.5 1.6V22" stroke="rgba(31,35,64,.8)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>

        <a href="#" title={copy.linkedin} aria-label={copy.linkedin}>
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M6.5 9.5V19" stroke="rgba(31,35,64,.8)" strokeWidth="2" strokeLinecap="round"/>
            <path d="M6.5 6.5h0" stroke="rgba(31,35,64,.8)" strokeWidth="4" strokeLinecap="round"/>
            <path d="M10.5 19v-5.3c0-2.8 4-3 4-0.2V19" stroke="rgba(31,35,64,.8)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14.5 13.2c0-2.8 4-3 4-0.2V19" stroke="rgba(31,35,64,.8)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>

        <a href="#" title={copy.email} aria-label={copy.email}>
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v9A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-9Z" stroke="rgba(31,35,64,.8)" strokeWidth="2"/>
            <path d="m6.5 8 5.5 4 5.5-4" stroke="rgba(31,35,64,.8)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>

      <div className="copyright">
        {copy.copyright}
      </div>
    </footer>
  );
}
