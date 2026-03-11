import { useEffect, useState } from "react";
import {
  LANGUAGE_STORAGE_KEY,
  LanguageContext,
  getInitialLanguage,
} from "./language-context";

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(getInitialLanguage);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    }

    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((currentLanguage) =>
      currentLanguage === "zh" ? "en" : "zh"
    );
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        isChinese: language === "zh",
        toggleLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}
