import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Check, X, Crown, Zap, ArrowRight, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/i18n/I18nContext";
import { supabase } from "@/integrations/supabase/client";
import { STRIPE_PRICES } from "@/lib/subscription";
import { toast } from "sonner";

const ProPage = () => {
  const { user, isPremium } = useAuth();
  const { t, locale, localePath } = useI18n();
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (plan: "monthly" | "yearly") => {
    if (!user) {
      toast.error(t("pro.login_required"));
      return;
    }
    setLoading(plan);
    try {
      // Route to Asaas (PT) or Stripe (EN) based on locale
      const isPt = locale === "pt";
      const functionName = isPt ? "create-asaas-checkout" : "create-checkout";
      const body = isPt
        ? { plan }
        : { priceId: STRIPE_PRICES[plan] };

      const { data, error } = await supabase.functions.invoke(functionName, { body });
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (err: any) {
      toast.error(err.message || "Erro ao iniciar checkout");
    } finally {
      setLoading(null);
    }
  };

  const handleManage = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("customer-portal");
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (err: any) {
      toast.error(err.message || "Erro ao abrir portal");
    }
  };

  const freeFeatures = [
    { text: t("pro.free_content"), included: true },
    { text: t("pro.free_quiz_generic"), included: true },
    { text: t("pro.free_quiz_specific"), included: true },
    { text: t("pro.free_result_basic"), included: true },
    { text: t("pro.free_video_1"), included: true },
    { text: t("pro.free_with_ads"), included: false },
  ];

  const proFeatures = [
    t("pro.pro_all_free"),
    t("pro.pro_no_ads"),
    t("pro.pro_unlimited_quiz"),
    t("pro.pro_dashboard"),
    t("pro.pro_evolution"),
    t("pro.pro_all_videos"),
    t("pro.pro_export_pdf"),
    t("pro.pro_plan_30"),
    t("pro.pro_exclusive"),
    t("pro.pro_recommendations"),
  ];

  const faqItems = [
    { q: t("pro.faq_cancel_q"), a: t("pro.faq_cancel_a") },
    { q: t("pro.faq_guarantee_q"), a: t("pro.faq_guarantee_a") },
    { q: t("pro.faq_data_q"), a: t("pro.faq_data_a") },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container py-12 md:py-20">
          <Link to={localePath("/")} className="mb-10 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-secondary transition-colors">
            <ArrowLeft className="h-4 w-4" /> {t("quiz.back")}
          </Link>

          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-14 text-center"
          >
            <Crown className="mx-auto mb-4 h-12 w-12 text-secondary" />
            <h1 className="mb-3 text-3xl font-bold text-title md:text-5xl">
              {t("pro.page_title")}
            </h1>
            <p className="mx-auto max-w-lg text-muted-foreground">
              {t("pro.page_subtitle")}
            </p>
          </motion.div>

          {/* Pricing cards */}
          <div className="mx-auto mb-16 grid max-w-4xl gap-6 md:grid-cols-2">
            {/* FREE */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <Card className="h-full">
                <CardContent className="p-6">
                  <h2 className="mb-1 text-xl font-bold text-title">FREE</h2>
                  <p className="mb-6 text-3xl font-bold text-foreground">
                    R$0<span className="text-sm font-normal text-muted-foreground">/{t("pro.month")}</span>
                  </p>
                  <ul className="mb-6 space-y-3">
                    {freeFeatures.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        {f.included ? (
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                        ) : (
                          <X className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                        )}
                        <span className={f.included ? "" : "text-muted-foreground"}>
                          {f.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to={localePath("/quiz/geral")}>
                      {t("pro.start_free")} <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* PRO */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
              <Card className="relative h-full border-secondary/50 shadow-lg">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-secondary px-4 py-1 text-xs font-bold text-secondary-foreground">
                  {t("pro.popular")}
                </div>
                <CardContent className="p-6">
                  <h2 className="mb-1 flex items-center gap-2 text-xl font-bold text-title">
                    <Zap className="h-5 w-5 text-secondary" /> PRO
                  </h2>

                  <div className="mb-6 space-y-2">
                    <p className="text-3xl font-bold text-foreground">
                      R$14,90<span className="text-sm font-normal text-muted-foreground">/{t("pro.month")}</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t("pro.or")} R$14,90/{t("pro.year")}{" "}
                      <span className="font-semibold text-accent">(PROMOÇÃO)</span>
                    </p>
                  </div>

                  <ul className="mb-6 space-y-3">
                    {proFeatures.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  {isPremium ? (
                    <Button onClick={handleManage} variant="outline" className="w-full">
                      {t("pro.manage_subscription")}
                    </Button>
                  ) : (
                    <div className="space-y-2">
                      <Button
                        onClick={() => handleCheckout("yearly")}
                        variant="hero"
                        className="w-full"
                        disabled={!!loading}
                      >
                        {loading === "yearly" ? "..." : t("pro.subscribe_yearly")}
                      </Button>
                      <Button
                        onClick={() => handleCheckout("monthly")}
                        variant="outline"
                        className="w-full"
                        disabled={!!loading}
                      >
                        {loading === "monthly" ? "..." : t("pro.subscribe_monthly")}
                      </Button>
                      <p className="text-center text-xs text-muted-foreground">
                        {t("pro.guarantee")}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* FAQ */}
          <div className="mx-auto max-w-2xl">
            <h2 className="mb-6 text-center text-2xl font-bold text-title">
              {t("pro.faq_title")}
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, i) => (
                <AccordionItem key={i} value={`faq-${i}`}>
                  <AccordionTrigger className="text-left text-sm font-medium">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProPage;
