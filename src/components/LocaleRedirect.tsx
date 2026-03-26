import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useI18n } from "@/i18n/I18nContext";

/** Redirects bare paths (no locale prefix) to "/{locale}/..." */
const LocaleRedirect = () => {
  const { locale } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get current path and prepend locale
    const path = location.pathname;
    // Remove any leading slash for clean concat
    const clean = path === "/" ? "" : path;
    navigate(`/${locale}${clean}`, { replace: true });
  }, [locale, navigate, location.pathname]);

  return null;
};

export default LocaleRedirect;
