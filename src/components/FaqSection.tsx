import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FaqItem } from "@/data/types";
import { useI18n } from "@/i18n/I18nContext";

interface FaqSectionProps {
  items: FaqItem[];
}

const FaqSection = ({ items }: FaqSectionProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { t } = useI18n();

  if (items.length === 0) return null;

  return (
    <section className="my-10">
      <h2 className="mb-6 text-xl font-bold md:text-2xl">{t("post.faq_title")}</h2>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="rounded-lg border border-border bg-card">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="flex w-full items-center justify-between px-5 py-4 text-left"
            >
              <span className="pr-4 text-sm font-semibold text-card-foreground">
                {item.question}
              </span>
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
                  openIndex === i ? "rotate-180" : ""
                }`}
              />
            </button>
            {openIndex === i && (
              <div className="border-t border-border px-5 py-4">
                <p className="text-sm text-muted-foreground leading-relaxed">{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FaqSection;
