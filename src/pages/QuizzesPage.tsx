import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Crown, 
  ArrowRight, 
  Clock, 
  Lock, 
  Search, 
  Sparkles,
  ChevronRight
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import PremiumAssessmentFlow from "@/components/PremiumAssessmentFlow";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/i18n/I18nContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useDimensions } from "@/hooks/useDimensions";
import { cn } from "@/lib/utils";

interface UnifiedQuiz {
  id: string;
  slug: string;
  title: string;
  description: string;
  estimated_time: number;
  is_premium: boolean;
  type: "simple" | "deep";
  theme: string;
}

const QuizzesPage = () => {
  const { t, locale, localePath } = useI18n();
  const { user, isPremium } = useAuth();
  const navigate = useNavigate();
  const { data: dimensions = [], isLoading: loadingDims } = useDimensions();
  const [quizzes, setQuizzes] = useState<UnifiedQuiz[]>([]);
  const [loadingQuizzes, setLoadingQuizzes] = useState(true);
  const [search, setSearch] = useState("");
  const [activeDeepAssessment, setActiveDeepAssessment] = useState<UnifiedQuiz | null>(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoadingQuizzes(true);
        
        // Fetch Standard Quizzes
        const { data: simpleData } = await supabase
          .from("quizzes")
          .select("*")
          .eq("is_active", true);

        // Fetch Premium Assessments
        const { data: deepData } = await supabase
          .from("premium_assessments")
          .select("*")
          .eq("is_active", true);

        const unified: UnifiedQuiz[] = [];

        if (simpleData) {
          simpleData.forEach((q: any) => {
            unified.push({
              id: q.id,
              slug: q.slug,
              title: locale === "en" ? (q.title_en || q.title) : (q.title_pt || q.title),
              description: locale === "en" ? (q.description_en || q.description) : (q.description_pt || q.description),
              estimated_time: q.estimated_time || 1,
              is_premium: false,
              type: "simple",
              theme: q.dimensions?.[0] || "geral",
            });
          });
        }

        if (deepData) {
          deepData.forEach((q: any) => {
            unified.push({
              id: q.id,
              slug: q.slug,
              title: locale === "en" ? q.title_en : q.title_pt,
              description: locale === "en" ? q.description_en : q.description_pt,
              estimated_time: q.estimated_time || 10,
              is_premium: true,
              type: "deep",
              theme: q.theme || "geral",
            });
          });
        }

        setQuizzes(unified);
      } catch (err) {
        console.error("Error fetching quizzes:", err);
      } finally {
        setLoadingQuizzes(false);
      }
    };

    fetchAllData();
  }, [locale]);

  const handleStart = (quiz: UnifiedQuiz) => {
    if (!user) {
      navigate(localePath("/login"));
      return;
    }

    if (quiz.type === "deep") {
      if (!isPremium) {
        navigate(localePath("/pro"));
      } else {
        setActiveDeepAssessment(quiz);
      }
      return;
    }

    navigate(localePath(`/quiz/${quiz.slug}`));
  };

  const filteredDimensions = dimensions.filter(dim => {
    const themeQuizzes = quizzes.filter(q => q.theme === dim.slug);
    if (themeQuizzes.length === 0) return false;
    
    if (!search) return true;
    
    const dimName = locale === "en" ? dim.name_en : dim.name_pt;
    const matchesDim = dimName.toLowerCase().includes(search.toLowerCase());
    const matchesQuizzes = themeQuizzes.some(q => 
      q.title.toLowerCase().includes(search.toLowerCase()) || 
      q.description.toLowerCase().includes(search.toLowerCase())
    );
    
    return matchesDim || matchesQuizzes;
  });

  return (
    <div className="flex min-h-screen flex-col">
      <SEOHead 
        title={`${t("nav.quiz")} | ValidZen`}
        description={t("pro.quizzes_subtitle")}
      />
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background py-16 md:py-24">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl opacity-50" />
          <div className="container relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto max-w-3xl text-center"
            >
              <Badge variant="outline" className="mb-4 border-secondary/30 text-secondary bg-secondary/5 px-3 py-1">
                <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                {t("home.step_1_title")}
              </Badge>
              <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-title md:text-6xl">
                {t("pro.quizzes_title")}
              </h1>
              <p className="mb-10 text-lg text-muted-foreground md:text-xl">
                {t("pro.quizzes_subtitle")}
              </p>
              
              <div className="relative mx-auto max-w-md">
                <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder={locale === "pt" ? "Buscar por tema ou teste..." : "Search by theme or quiz..."}
                  className="h-12 pl-11 rounded-full border-border/50 bg-background shadow-lg shadow-primary/5 ring-secondary/20 focus-visible:ring-secondary transition-all"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Content Section */}
        <section className="container py-12 md:py-20">
          {(loadingDims || loadingQuizzes) ? (
            <div className="grid gap-12">
              {[1, 2].map(i => (
                <div key={i} className="space-y-6">
                  <div className="h-8 w-48 animate-pulse rounded bg-muted" />
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map(j => (
                      <div key={j} className="h-48 animate-pulse rounded-xl bg-muted/50" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-20">
              {filteredDimensions.map((dim, idx) => {
                const themeQuizzes = quizzes.filter(q => q.theme === dim.slug);
                const simpleOnes = themeQuizzes.filter(q => q.type === "simple");
                const deepOne = themeQuizzes.find(q => q.type === "deep");
                const dimName = locale === "en" ? dim.name_en : dim.name_pt;

                return (
                  <motion.div 
                    key={dim.slug}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <div className="mb-8 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-2xl shadow-sm">
                          {dim.icon || "⚓"}
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold tracking-tight text-title">{dimName}</h2>
                          <p className="text-sm text-muted-foreground">
                            {locale === "pt" ? `${themeQuizzes.length} ferramentas de autoconhecimento` : `${themeQuizzes.length} self-knowledge tools`}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-12">
                      {/* Standard Quizzes Grid */}
                      <div className="grid gap-4 lg:col-span-8 md:grid-cols-2">
                        {simpleOnes.map(quiz => (
                          <Card 
                            key={quiz.id} 
                            className="group relative h-full overflow-hidden border-border/40 bg-card transition-all hover:border-secondary/30 hover:shadow-xl hover:shadow-secondary/5"
                          >
                            <CardContent className="flex h-full flex-col p-6">
                              <div className="mb-4 flex items-center justify-between">
                                <Badge variant="secondary" className="bg-muted/50 text-muted-foreground text-[10px] uppercase tracking-wider">
                                  {t("pro.simple_quizzes")}
                                </Badge>
                                <span className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
                                  <Clock className="h-3 w-3" />
                                  {quiz.estimated_time} {t("pro.month")}
                                </span>
                              </div>
                              <h3 className="mb-2 text-lg font-bold text-title group-hover:text-secondary transition-colors">
                                {quiz.title}
                              </h3>
                              <p className="mb-6 flex-1 text-sm text-muted-foreground line-clamp-2">
                                {quiz.description}
                              </p>
                              <Button 
                                variant="ghost" 
                                className="mt-auto w-full justify-between bg-muted/30 group-hover:bg-secondary group-hover:text-white transition-all"
                                onClick={() => handleStart(quiz)}
                              >
                                {t("pro.start_quiz")}
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>

                      {/* Deep Assessment Highlight */}
                      {deepOne && (
                        <div className="lg:col-span-4">
                          <Card 
                            className="group relative h-full overflow-hidden border-secondary/20 bg-gradient-to-br from-background via-card to-secondary/5 shadow-lg ring-1 ring-secondary/10"
                          >
                            <CardContent className="flex h-full flex-col p-8">
                              <div className="mb-6 flex items-center justify-between">
                                <Badge variant="secondary" className="bg-secondary/10 text-secondary border-secondary/20 text-[10px] font-bold uppercase tracking-widest">
                                  {t("pro.pro_badge")}
                                </Badge>
                                <div className="flex items-center gap-2">
                                  <div className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
                                  <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">
                                    {t("pro.premium_assessments")}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/10 text-secondary shadow-inner">
                                <Crown className="h-7 w-7" />
                              </div>

                              <h3 className="mb-3 text-2xl font-black tracking-tight text-title leading-tight">
                                {deepOne.title}
                              </h3>
                              
                              <p className="mb-8 flex-1 text-sm leading-relaxed text-muted-foreground italic">
                                "{deepOne.description}"
                              </p>

                              <div className="mb-8 space-y-4">
                                <div className="flex items-center gap-3 text-xs font-semibold text-title">
                                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary/20 text-secondary">
                                    <Clock className="h-3 w-3" />
                                  </div>
                                  <span>{deepOne.estimated_time} {t("post.min_read")}</span>
                                </div>
                                <div className="flex items-center gap-3 text-xs font-semibold text-title">
                                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary/20 text-secondary">
                                    <Lock className="h-3 w-3" />
                                  </div>
                                  <span>{locale === "pt" ? "Personalizado & Clínico" : "Personalized & Clinical"}</span>
                                </div>
                              </div>

                              <Button 
                                className="w-full bg-secondary text-white shadow-lg shadow-secondary/20 hover:bg-secondary/90 hover:scale-[1.02] transition-all transform active:scale-95 py-6 font-bold"
                                onClick={() => handleStart(deepOne)}
                              >
                                {t("pro.start_deep")}
                                <ArrowRight className="ml-2 h-5 w-5" />
                              </Button>
                            </CardContent>
                          </Card>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}

              {!filteredDimensions.length && !loadingDims && (
                <div className="py-20 text-center">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                    <Search className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-bold text-title">
                    {locale === "pt" ? "Nenhum resultado encontrado" : "No results found"}
                  </h3>
                  <p className="text-muted-foreground">
                    {locale === "pt" ? "Tente buscar por termos diferentes." : "Try searching for different terms."}
                  </p>
                  <Button variant="link" onClick={() => setSearch("")} className="mt-4 text-secondary">
                    {locale === "pt" ? "Limpar busca" : "Clear search"}
                  </Button>
                </div>
              )}
            </div>
          )}
        </section>

        {/* PRO Banner */}
        {!isPremium && (
          <section className="container mb-24">
            <div className="rounded-3xl bg-secondary p-8 md:p-16 text-center text-white relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
              <div className="relative z-10 mx-auto max-w-2xl">
                <Crown className="mx-auto mb-6 h-16 w-16 opacity-50" />
                <h2 className="mb-6 text-3xl font-bold md:text-5xl">{t("pro.page_title")}</h2>
                <p className="mb-10 text-lg opacity-90">{t("pro.page_subtitle")}</p>
                <Button size="lg" variant="hero" className="bg-white text-secondary hover:bg-white/90" asChild>
                  <Link to={localePath("/pro")}>{t("pro.upgrade_cta")}</Link>
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* Deep Assessment Flow Modal */}
        <Dialog 
          open={!!activeDeepAssessment} 
          onOpenChange={(open) => !open && setActiveDeepAssessment(null)}
        >
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{activeDeepAssessment?.title}</DialogTitle>
              <DialogDescription>{activeDeepAssessment?.description}</DialogDescription>
            </DialogHeader>
            {activeDeepAssessment && (
              <PremiumAssessmentFlow
                assessmentSlug={activeDeepAssessment.slug}
                onComplete={() => {
                  setActiveDeepAssessment(null);
                  navigate(localePath("/dashboard"));
                }}
              />
            )}
          </DialogContent>
        </Dialog>
      </main>
      
      <Footer />
    </div>
  );
};

export default QuizzesPage;
