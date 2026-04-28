import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
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
import { supabase } from "@/integrations/supabase/client";
import { STRIPE_PRICES } from "@/lib/subscription";
import { toast } from "sonner";

const ProPage = () => {
  const { user, isPremium } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (plan: "monthly" | "promo6") => {
    if (!user) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    setLoading(plan);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { priceId: STRIPE_PRICES[plan] }
      });
      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      toast.error(err.message || "We couldn't initialize your checkout. Please share your attempt again.");
    } finally {
      setLoading(null);
    }
  };

  const handleManage = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("customer-portal");
      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      toast.error(err.message || "We couldn't open your portal at this time.");
    }
  };

  const freeFeatures = [
    { text: "Access to introductory self-knowledge content", included: true },
    { text: "Begin core Journeys & assessments", included: true },
    { text: "Limited specific pattern explorations", included: true },
    { text: "Basic insight summaries", included: true },
    { text: "Guided introductory videos", included: true },
    { text: "Ad-supported experience", included: false },
  ];

  const proFeatures = [
    "Everything in Free, plus:",
    "Completely ad-free experience",
    "Unlimited access to all Journeys & Discovery tools",
    "Personalized Insight Blueprint",
    "Evolution tracking toward self-mastery",
    "Access to the full library of guided wisdom",
    "Export detailed PDF clinical-grade blueprints",
    "Tailored 30-day self-mastery plan",
    "Exclusive deep-pattern content",
    "Personalized self-mastery recommendations",
  ];

  const faqItems = [
    { 
      q: "Can I cancel my membership at any time?", 
      a: "Yes, you can pause or cancel your journey whenever you like. You'll retain your PRO access until the end of your current cycle." 
    },
    { 
      q: "Is there a satisfaction guarantee?", 
      a: "Absolutely. If you feel ValidZen hasn't restored your internal agency within the first 7 days, contact us for a full refund." 
    },
    { 
      q: "Is my blueprint data secure and private?", 
      a: "Your privacy is our priority. All your discovery data is encrypted and never shared. We protect your inner world." 
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container py-12 md:py-20">
          <Link to="/quizzes" className="mb-10 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-secondary transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Journeys
          </Link>

          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16 text-center"
          >
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-secondary/10 text-secondary shadow-lg shadow-secondary/10">
              <Crown className="h-8 w-8" />
            </div>
            <h1 className="mb-4 text-4xl font-bold text-title md:text-6xl tracking-tight">
              Reclaim Your Self-Mastery
            </h1>
            <p className="mx-auto max-w-lg text-lg text-muted-foreground leading-relaxed">
              Deepen your journey of self-discovery with ValidZen PRO. We’ve gathered the most advanced tools to map your internal agency.
            </p>
          </motion.div>

          {/* Pricing cards */}
          <div className="mx-auto mb-20 grid max-w-5xl gap-8 md:grid-cols-2">
            {/* FREE */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <Card className="h-full border-border/50 shadow-sm hover:shadow-xl transition-all rounded-[2rem]">
                <CardContent className="p-10 flex flex-col h-full">
                  <h2 className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">Core Access</h2>
                  <p className="mb-8 text-5xl font-bold text-foreground">
                    Free
                  </p>
                  <ul className="mb-10 space-y-4 flex-1">
                    {freeFeatures.map((f, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm font-bold">
                        {f.included ? (
                          <Check className="mt-1 h-4 w-4 shrink-0 text-accent" />
                        ) : (
                          <X className="mt-1 h-4 w-4 shrink-0 text-destructive opacity-40" />
                        )}
                        <span className={f.included ? "text-title" : "text-muted-foreground line-through opacity-50"}>
                          {f.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className="w-full py-7 rounded-xl font-bold uppercase text-[10px] tracking-widest border-border hover:bg-secondary/5" asChild>
                    <Link to="/quizzes">
                      Start Core Journey <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* PRO */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
              <Card className="relative h-full border-secondary/30 shadow-2xl shadow-secondary/5 rounded-[2.5rem] bg-gradient-to-br from-card to-secondary/5">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-secondary px-6 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-secondary-foreground shadow-xl">
                  UNLIMITED MASTERY
                </div>
                <CardContent className="p-10 flex flex-col h-full">
                  <h2 className="mb-2 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-secondary">
                    <Zap className="h-4 w-4" /> PRO Blueprint
                  </h2>

                  <div className="mb-8 space-y-2">
                    <p className="text-5xl font-bold text-foreground">
                      $2.99<span className="text-sm font-bold uppercase tracking-widest text-muted-foreground not-italic"> / month</span>
                    </p>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                      or $14.99 for 6 months{" "}
                      <span className="text-secondary opacity-80">(Best Value)</span>
                    </p>
                  </div>

                  <ul className="mb-10 space-y-4 flex-1">
                    {proFeatures.map((f, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm font-bold text-title">
                        <Check className="mt-1 h-4 w-4 shrink-0 text-secondary" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  {isPremium ? (
                    <Button onClick={handleManage} variant="outline" className="w-full py-7 rounded-xl font-bold uppercase text-[10px] tracking-widest border-secondary/20 hover:bg-secondary/10 text-secondary">
                      Manage My Blueprint
                    </Button>
                  ) : (
                    <div className="space-y-4">
                      <Button
                        onClick={() => handleCheckout("promo6")}
                        variant="hero"
                        className="w-full py-8 rounded-full font-bold uppercase tracking-widest text-md shadow-2xl shadow-secondary/30 transition-transform hover:scale-105 active:scale-95"
                        disabled={!!loading}
                      >
                        {loading === "promo6" ? "Initializing Discovery..." : "Unlock 6-Month Mastery"}
                      </Button>
                      <Button
                        onClick={() => handleCheckout("monthly")}
                        variant="outline"
                        className="w-full py-7 rounded-full font-bold uppercase text-[10px] tracking-widest border-secondary/20 hover:bg-secondary/10 text-secondary"
                        disabled={!!loading}
                      >
                        {loading === "monthly" ? "Gathering Insights..." : "Begin Monthly Journey"}
                      </Button>
                      <p className="text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">
                        7-day self-mastery guarantee
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* FAQ */}
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-10 text-center text-3xl font-bold text-title">
              Discovery FAQ
            </h2>
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqItems.map((item, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="border-none bg-muted/20 rounded-2xl px-8 transition-all hover:bg-muted/40">
                  <AccordionTrigger className="text-left text-sm font-bold uppercase tracking-widest hover:no-underline py-6">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-md text-muted-foreground leading-relaxed pb-6">
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
