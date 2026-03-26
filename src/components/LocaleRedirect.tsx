import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/i18n/I18nContext";

/** Redirects bare "/" to "/{locale}/" */
const LocaleRedirect = () => {
  const { locale } = useI18n();
  const navigate = useNavigate();

  useEffect(() => {
    navigate(`/${locale}`, { replace: true });
  }, [locale, navigate]);

  return null;
};

export default LocaleRedirect;
