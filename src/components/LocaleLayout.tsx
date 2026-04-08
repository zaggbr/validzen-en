import { useEffect } from "react";
import { useParams, useNavigate, Outlet } from "react-router-dom";
import { useI18n, Locale } from "@/i18n/I18nContext";
import CookieConsent from "./CookieConsent";

const LocaleLayout = () => {
  const { lang } = useParams<{ lang: string }>();
  const { locale, setLocale } = useI18n();
  const navigate = useNavigate();

  useEffect(() => {
    if (lang === "pt" || lang === "en") {
      if (lang !== locale) {
        setLocale(lang as Locale);
      }
    }
  }, [lang, locale, setLocale]);

  return (
    <>
      <Outlet />
      <CookieConsent />
    </>
  );
};

export default LocaleLayout;
