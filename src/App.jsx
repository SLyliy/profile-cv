// 应用总装配（把 Shell/Navbar/Home/Footer 组合成单页）
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Shell from './components/shell/Shell';
import Navbar from './components/navbar/Navbar';
import Cover from "./pages/Cover/Cover";
import Home from "./pages/Home/Home";
import Contact from "./pages/Contact/Contact";
import Project from "./pages/Project/Project";
import Feedback from "./pages/Feedback/Feedback";
import Footer from './components/footer/Footer';
import LChatWidget from "./components/chat/LChatWidget";
import { LanguageProvider } from "./i18n/LanguageContext";

function AppInner() {
  const location = useLocation();
  const isCover = location.pathname === "/";
  return (
    <Shell>
      <Navbar />
      <Routes>
        <Route path="/" element={<Cover />} />
        <Route path="/home" element={<Home />} />
        <Route path="/project" element={<Project />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <Footer />
      {!isCover && <LChatWidget />}
    </Shell>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <AppInner />
      </BrowserRouter>
    </LanguageProvider>
  );
}
