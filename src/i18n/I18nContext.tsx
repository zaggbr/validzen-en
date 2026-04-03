import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import ptTranslations from "./pt.json";
import enTranslations from "./en.json";

export type Locale = "pt" | "en";

const translations: Record<Locale, Record<string, any>> = {
  pt: ptTranslations,
  en: enTranslations,
};

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  localePath: (path: string) => string;
}

const I18nContext = createContext<I18nContextType>({
  locale: "pt",
  setLocale: () => {},
  t: (key) => key,
  localePath: (path) => path,
});

export const useI18n = () => useContext(I18nContext);

function getNestedValue(obj: any, path: string): string | undefined {
  return path.split(".").reduce((acc, part) => acc?.[part], obj);
}

function detectLocaleFromURL(): Locale | null {
  const path = window.location.pathname;
  if (path.startsWith("/en")) return "en";
  if (path.startsWith("/pt")) return "pt";
  return null;
}

function detectBrowserLocale(): Locale {
  const lang = navigator.language?.toLowerCase() ?? "";
  if (lang.startsWith("pt")) return "pt";
  return "en";
}

function getInitialLocale(): Locale {
  // 1. URL prefix still takes priority if explicitly requested
  const urlLocale = detectLocaleFromURL();
  if (urlLocale) return urlLocale;

  // 2. Otherwise, always default to Portuguese for now
  return "pt";
}

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("validzen_locale", newLocale);
    document.documentElement.lang = newLocale === "pt" ? "pt-BR" : "en";
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale === "pt" ? "pt-BR" : "en";
  }, [locale]);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      let value = getNestedValue(translations[locale], key) ?? key;
      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          value = value.replace(new RegExp(`\\{\\{${k}\\}\\}`, "g"), String(v));
        });
      }
      return value;
    },
    [locale]
  );

  const localePath = useCallback(
    (path: string): string => {
      // Remove existing locale prefix
      const clean = path.replace(/^\/(pt|en)/, "");
      return `/${locale}${clean || "/"}`;
    },
    [locale]
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, localePath }}>
      {children}
    </I18nContext.Provider>
  );
};
