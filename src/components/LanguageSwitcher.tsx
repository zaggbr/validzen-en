import { useI18n, Locale } from "@/i18n/I18nContext";
import { useNavigate, useLocation } from "react-router-dom";

const LanguageSwitcher = () => {
  const { locale, setLocale } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();

  const toggle = () => {
    const newLocale: Locale = locale === "pt" ? "en" : "pt";
    setLocale(newLocale);
    // Replace locale prefix in current URL
    const newPath = location.pathname.replace(/^\/(pt|en)/, `/${newLocale}`);
    navigate(newPath + location.search, { replace: true });
  };

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      aria-label="Switch language"
    >
      <span className={locale === "pt" ? "opacity-100" : "opacity-50"}>🇧🇷</span>
      <span className="text-muted-foreground/50">|</span>
      <span className={locale === "en" ? "opacity-100" : "opacity-50"}>🇺🇸</span>
    </button>
  );
};

export default LanguageSwitcher;
