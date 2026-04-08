import { Link } from "react-router-dom";
import { useI18n } from "@/i18n/I18nContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Instagram } from "lucide-react";

const Footer = () => {
  const { t, localePath } = useI18n();

  return (
    <footer className="border-t border-border bg-card">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <span className="text-lg font-bold text-title">
              valid<span className="text-secondary">zen</span>.
            </span>
            <p className="mt-2 text-sm text-muted-foreground">{t("common.tagline")}</p>
            <p className="mt-1 text-xs text-muted-foreground">{t("common.tagline_sub")}</p>
            <div className="mt-4 flex gap-3">
              <a href="https://instagram.com/validzen" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-secondary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-foreground">{t("common.links")}</span>
            <Link to={localePath("/sobre")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t("common.about")}</Link>
            <Link to={localePath("/termos")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t("common.terms")}</Link>
            <Link to={localePath("/privacidade")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t("common.privacy")}</Link>
            <a href="mailto:info@validzen.com" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t("common.contact")}</a>
            <Link to={localePath("/pro")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pro</Link>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-foreground">{t("common.important")}</span>
            <p className="text-xs text-muted-foreground leading-relaxed">{t("common.disclaimer")}</p>
            <p className="text-xs font-medium text-secondary">{t("common.emergency")}</p>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 md:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} ValidZen. {t("common.rights")}
          </p>
          <LanguageSwitcher />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
