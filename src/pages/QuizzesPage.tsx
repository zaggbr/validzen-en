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

interface Theme {
  slug: string;
  name_pt: string;
  name_en: string;
  icon: string;
}

// Hardcoded themes — independent of DB dimensions table
const THEMES: Theme[] = [
  { slug: "ansiedade",  name_pt: "Ansiedade",   name_en: "Anxiety",       icon: "😰" },
  { slug: "burnout",    name_pt: "Burnout",      name_en: "Burnout",       icon: "🔥" },
  { slug: "emocoes",    name_pt: "Emoções",      name_en: "Emotions",      icon: "🎭" },
  { slug: "relacoes",   name_pt: "Relações",     name_en: "Relationships", icon: "💔" },
  { slug: "identidade", name_pt: "Identidade",   name_en: "Identity",      icon: "👤" },
  { slug: "sentido",    name_pt: "Sentido",      name_en: "Purpose",       icon: "🧭" },
  { slug: "sociedade",  name_pt: "Sociedade",    name_en: "Society",       icon: "🌍" },
];

const SIMPLE_QUIZ_THEME_MAP: Record<string, string> = {
  "luto-civilizatorio-futuro": "sociedade",
  "teste-crise-reprodutiva": "relacoes",
  "teste-anemoia": "sentido",
  "teste-perfeccionismo-procrastinacao": "ansiedade",
  "teste-luto-nao-reconhecido": "sociedade",
  "teste-fawning-people-pleasing": "relacoes",
  "teste-dismorfia-temporal": "burnout",
  "teste-embotamento-emocional": "emocoes",
  "teste-alexitimia": "emocoes",
  "teste-vergonha-cronica": "identidade",
  "teste-raiva-reprimida": "emocoes",
  "geral": "emocoes",
};

const QuizzesPage = () => {
  const { t, locale, localePath } = useI18n();
  const { user, isPremium, userUsage } = useAuth();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<UnifiedQuiz[]>([]);
  const [loadingQuizzes, setLoadingQuizzes] = useState(true);
  const [search, setSearch] = useState("");
  const [activeDeepAssessment, setActiveDeepAssessment] = useState<UnifiedQuiz | null>(null);

  // Quizzes page is a Vitrine for non-PRO users — content visible, no blur, only actions blocked
  const isLocked = !isPremium;
  const lockType = !user ? "login" : "upgrade";

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
              theme: SIMPLE_QUIZ_THEME_MAP[q.slug] || "geral",
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

  const filteredThemes = THEMES.filter(theme => {
    const themeQuizzes = quizzes.filter(q => q.theme === theme.slug);
    if (themeQuizzes.length === 0) return false;

    if (!search) return true;

    const dimName = locale === "en" ? theme.name_en : theme.name_pt;
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
        <section className="container py-12 md:py-20 relative">
          {(!loadingQuizzes && isLocked) && (
            <div className="absolute inset-x-0 z-40 flex items-start justify-center pt-20 pointer-events-none min-h-[600px]">
              <div className="sticky top-[30vh] max-w-lg w-full bg-card/95 border border-border shadow-2xl shadow-primary/5 rounded-3xl p-10 text-center pointer-events-auto mx-4 backdrop-blur-md">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
                  <Lock className="h-8 w-8" />
                </div>
                <h2 className="text-3xl font-extrabold mb-4">{lockType === "login" ? t("pro.unlock_title") : t("pro.quiz_limit_title")}</h2>
                <p className="text-muted-foreground mb-8 text-lg">
                  {lockType === "login" 
                    ? (locale === "pt" ? "Crie sua conta livre ou assine o PRO para acessar o diretório de testes." : "Create your free account or subscribe to PRO to access the tests directory.")
                    : (locale === "pt" ? "Você atingiu o limite de 3 quizzes gratuitos. Assine o PRO para acesso ilimitado!" : "You've reached the free limit of 3 quizzes. Subscribe to PRO for unlimited access!")
                  }
                </p>
                <div className="flex flex-col gap-4">
                  <Button asChild size="lg" variant="hero" className="py-7 text-lg shadow-lg shadow-primary/20">
                    <Link to={localePath(user ? "/pro" : "/login")}>
                      {user ? t("pro.upgrade_cta") : t("result.create_account")}
                    </Link>
                  </Button>
                  {lockType === "login" && (
                    <Button asChild variant="link" className="text-muted-foreground">
                       <Link to={localePath("/login")}>{locale === "pt" ? "Já tenho uma conta" : "I already have an account"}</Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          {loadingQuizzes ? (
            <div className="grid gap-12">
              {[1, 2].map(i => (
                <div key={i} className="space-y-6">
                  <div className="h-8 w-48 animate-pulse rounded bg-muted" />
                  <div className="flex flex-col gap-4">
                    {[1, 2].map(j => (
                      <div key={j} className="h-24 animate-pulse rounded-xl bg-muted/50" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={cn("space-y-20 transition-all duration-700", isLocked && "pointer-events-none select-none")}>
              {filteredThemes.map((theme, idx) => {
                const themeQuizzes = quizzes.filter(q => q.theme === theme.slug);
                const simpleOnes = themeQuizzes.filter(q => q.type === "simple");
                const deepOne = themeQuizzes.find(q => q.type === "deep");
                const dimName = locale === "en" ? theme.name_en : theme.name_pt;

                return (
                  <motion.div
                    key={theme.slug}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <div className="mb-8 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-2xl shadow-sm">
                          {theme.icon}
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold tracking-tight text-title">{dimName}</h2>
                          <p className="text-sm text-muted-foreground">
                            {locale === "pt" ? `${themeQuizzes.length} ferramentas de autoconhecimento` : `${themeQuizzes.length} self-knowledge tools`}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-8">
                      {/* Standard Quizzes List - Single Column */}
                      <div className="flex flex-col gap-4">
                        {simpleOnes.map(quiz => (
                          <Card 
                            key={quiz.id} 
                            className="group relative overflow-hidden border-border/40 bg-card transition-all hover:border-secondary/30 hover:shadow-lg hover:shadow-secondary/5"
                          >
                            <CardContent className="flex flex-col md:flex-row items-center justify-between p-6 gap-6">
                              <div className="flex-1 text-center md:text-left">
                                <div className="mb-2 flex items-center justify-center md:justify-start gap-3">
                                   <Badge variant="secondary" className="bg-muted/50 text-muted-foreground text-[10px] uppercase tracking-wider">
                                     {t("pro.simple_quizzes")}
                                   </Badge>
                                   <span className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
                                     <Clock className="h-3 w-3" />
                                     {quiz.estimated_time} {t("post.min_read")}
                                   </span>
                                </div>
                                <h3 className="mb-1 text-xl font-bold text-title group-hover:text-secondary transition-colors">
                                  {quiz.title}
                                </h3>
                                <p className="text-sm text-balance text-muted-foreground line-clamp-1 opacity-80">
                                  {quiz.description}
                                </p>
                              </div>
                              <div className="min-w-[160px] w-full md:w-auto">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="w-full justify-between bg-muted/20 group-hover:bg-secondary group-hover:text-white transition-all shadow-sm py-5 px-6 font-semibold"
                                  onClick={() => handleStart(quiz)}
                                >
                                  {t("pro.start_quiz")}
                                  <ChevronRight className="h-4 w-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
 
                      {/* Deep Assessment Highlight - Full width row */}
                      {deepOne && (
                        <Card 
                          className="group relative overflow-hidden border-secondary/20 bg-gradient-to-r from-secondary/5 via-card to-background shadow-lg ring-1 ring-secondary/10"
                        >
                          <CardContent className="flex flex-col md:flex-row p-8 items-center gap-8">
                            <div className="mb-4 md:mb-0 flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-secondary/10 text-secondary shadow-inner">
                              <Crown className="h-10 w-10 text-secondary" />
                            </div>
                            
                            <div className="flex-1 text-center md:text-left">
                              <div className="mb-2 flex flex-wrap items-center justify-center md:justify-start gap-4">
                                <Badge variant="secondary" className="bg-secondary/10 text-secondary border-secondary/20 text-[10px] font-bold uppercase tracking-widest">
                                  {t("pro.pro_badge")}
                                </Badge>
                                <span className="text-[10px] font-bold text-secondary uppercase tracking-widest flex items-center gap-2">
                                  <div className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
                                  {t("pro.premium_assessments")}
                                </span>
                              </div>
                              <h3 className="mb-2 text-3xl font-black tracking-tight text-title">
                                {deepOne.title}
                              </h3>
                              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground italic">
                                "{deepOne.description}"
                              </p>
                            </div>
 
                            <div className="flex flex-col gap-4 min-w-[200px] w-full md:w-auto">
                              <div className="flex items-center justify-center md:justify-start gap-6">
                                <div className="flex items-center gap-2 text-xs font-semibold text-title">
                                  <Clock className="h-4 w-4 text-secondary" />
                                  <span>{deepOne.estimated_time} {t("post.min_read")}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs font-semibold text-title">
                                  <Lock className="h-4 w-4 text-secondary" />
                                  <span>{locale === "pt" ? "Personalizado & Clínico" : "Personalized & Clinical"}</span>
                                </div>
                              </div>
                              <Button 
                                className="w-full bg-secondary text-white shadow-xl shadow-secondary/30 hover:bg-secondary/90 hover:scale-[1.02] transition-all transform active:scale-95 py-6 font-bold text-lg"
                                onClick={() => handleStart(deepOne)}
                              >
                                {t("pro.start_deep")}
                                <ArrowRight className="ml-2 h-5 w-5" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </motion.div>
                );
              })}

              {!filteredThemes.length && (
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
