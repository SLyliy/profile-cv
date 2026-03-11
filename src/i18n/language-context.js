import { createContext, useContext } from "react";

export const LANGUAGE_STORAGE_KEY = "profile-react-language";
export const DEFAULT_LANGUAGE = "en";

export const LanguageContext = createContext(null);

export function getInitialLanguage() {
  if (typeof window === "undefined") {
    return DEFAULT_LANGUAGE;
  }

  const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return storedLanguage === "zh" ? "zh" : DEFAULT_LANGUAGE;
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider.");
  }

  return context;
}
