import { useI18n, Locale } from "@/i18n/I18nContext";
import { useNavigate, useLocation } from "react-router-dom";

const LanguageSwitcher = () => {
  const { locale, setLocale, localePath } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSwitch = (newLocale: Locale) => {
    setLocale(newLocale);
    // Explicitly navigate to the PT version of the current path
    const path = location.pathname.replace(/^\/en/, "/pt");
    navigate(path, { replace: true });
  };

  // If already in PT, keep it hidden (EN is not ready)
  if (locale === "pt") return null;

  // If stuck in EN, show a way back to PT
  return (
    <button
      onClick={() => handleSwitch("pt")}
      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-secondary/10 hover:bg-secondary/20 text-secondary rounded-full transition-colors border border-secondary/20"
    >
      🇧🇷 Voltar para Português
    </button>
  );
};

export default LanguageSwitcher;
