import { useI18n } from "@/i18n/I18nContext";

const Disclaimer = () => {
  const { t } = useI18n();

  return (
    <div className="rounded-lg border border-secondary/20 bg-secondary/5 px-5 py-4">
      <p className="text-xs font-medium text-secondary">⚠️ {t("common.disclaimer_label")}</p>
      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
        {t("common.disclaimer_full")}
      </p>
    </div>
  );
};

export default Disclaimer;
