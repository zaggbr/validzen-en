import { Compass, MessageCircleQuestion, Map, BookOpen } from "lucide-react";
import { useI18n } from "@/i18n/I18nContext";

const HowItWorks = () => {
  const { t } = useI18n();

  const icons = [Compass, MessageCircleQuestion, Map, BookOpen];

  const steps = [1, 2, 3, 4].map((n, i) => ({
    icon: icons[i],
    title: t(`home.step_${n}_title`),
    description: t(`home.step_${n}_desc`),
  }));

  return (
    <section className="bg-muted/30 py-16 md:py-20">
      <div className="container">
        <h2 className="mb-2 text-center text-2xl font-bold md:text-3xl">
          {t("home.section_how")}
        </h2>
        <p className="mb-12 text-center text-sm text-muted-foreground">
          {t("home.section_how_sub")}
        </p>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/10">
                <step.icon className="h-6 w-6 text-secondary" />
              </div>
              <span className="mb-1 text-xs font-bold uppercase tracking-wider text-secondary">
                {t("home.step_prefix")} {i + 1}
              </span>
              <h3 className="mb-2 text-sm font-semibold">{step.title}</h3>
              <p className="text-xs text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
