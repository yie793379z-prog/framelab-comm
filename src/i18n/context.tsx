"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { appDictionary } from "@/i18n/dictionary";
import type { Locale } from "@/i18n/types";

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  messages: (typeof appDictionary)[Locale];
};

const LANGUAGE_STORAGE_KEY = "framelab-locale";

const LanguageContext = createContext<LanguageContextValue | null>(null);

type LanguageProviderProps = {
  children: React.ReactNode;
};

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [locale, setLocale] = useState<Locale>("en");

  useEffect(() => {
    const storedLocale = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);

    if (storedLocale === "en" || storedLocale === "zh-CN") {
      setLocale(storedLocale);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, locale);
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <LanguageContext.Provider
      value={{
        locale,
        setLocale,
        messages: appDictionary[locale]
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }

  return context;
}
