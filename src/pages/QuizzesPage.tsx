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
  name: string;
  icon: string;
}

const THEMES: Theme[] = [
  { slug: "anxiety",      name: "Anxiety & Inner Clarity",       icon: "🧘" },
  { slug: "burnout",      name: "Burnout & Sustainable Vitality", icon: "🔥" },
  { slug: "emotions",     name: "The Science of Feeling",        icon: "🎭" },
  { slug: "relationships", name: "The Art of Connection",         icon: "🤝" },
  { slug: "identity",     name: "The Autonomy Blueprint",        icon: "👤" },
  { slug: "purpose",      name: "The Meaning Quest",             icon: "🧭" },
  { slug: "society",      name: "Navigating Modern Chaos",       icon: "🌍" },
];

const REFINED_TITLES: Record<string, string> = {
  "anxiety": "Anxiety & Inner Clarity",
  "burnout": "Burnout & Sustainable Vitality",
  "emotions": "The Science of Feeling",
  "ai_future": "Futurism & Tech-Wellbeing",
  "identity": "The Autonomy Blueprint",
  "relationships": "The Art of Connection",
  "meaning": "The Meaning Quest",
  "society": "Navigating Modern Chaos",
  "deep-assessment-anxiety": "Deep Journey: Anxiety & Inner Clarity",
  "deep-assessment-burnout": "Deep Journey: Sustainable Vitality",
  "deep-assessment-emotions": "Deep Journey: The Science of Feeling",
  "deep-assessment-relationships": "Deep Journey: The Art of Connection",
  "deep-assessment-identity": "Deep Journey: The Autonomy Blueprint",
  "deep-assessment-meaning": "Deep Journey: The Meaning Quest",
  "deep-assessment-society": "Deep Journey: Navigating Modern Chaos",
};

const SIMPLE_QUIZ_THEME_MAP: Record<string, string> = {
  "luto-civilizatorio-futuro": "society",
  "teste-crise-reprodutiva": "relationships",
  "teste-anemoia": "purpose",
  "teste-perfeccionismo-procrastinacao": "anxiety",
  "teste-luto-nao-reconhecido": "society",
  "teste-fawning-people-pleasing": "relationships",
  "teste-dismorfia-temporal": "burnout",
  "teste-embotamento-emocional": "emotions",
  "teste-alexitimia": "emotions",
  "teste-vergonha-cronica": "identity",
  "teste-raiva-reprimida": "emotions",
  "general": "emotions",
};

const QuizzesPage = () => {
  const { user, isPremium } = useAuth();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<UnifiedQuiz[]>([]);
  const [loadingQuizzes, setLoadingQuizzes] = useState(true);
  const [search, setSearch] = useState("");
  const [activeDeepAssessment, setActiveDeepAssessment] = useState<UnifiedQuiz | null>(null);

  const isLocked = !isPremium;
  const lockType = !user ? "login" : "upgrade";

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoadingQuizzes(true);
        
        const { data: simpleData } = await supabase
          .from("quizzes")
          .select("*")
          .eq("is_active", true);

        const { data: deepData } = await supabase
          .from("premium_assessments")
          .select("*")
          .eq("is_active", true);

        const unified: UnifiedQuiz[] = [];

        if (simpleData) {
          simpleData.forEach((q: any) => {
            const theme = SIMPLE_QUIZ_THEME_MAP[q.slug] || "emotions";
            unified.push({
              id: q.id,
              slug: q.slug,
              // quizzes table: only title_en / title_pt (no plain title)
              title: REFINED_TITLES[q.slug] || q.title_en || q.title_pt || "",
              description: q.description_en || q.description_pt || "",
              estimated_time: q.estimated_time || 1,
              is_premium: false,
              type: "simple",
              theme,
            });
          });
        }

        if (deepData) {
          deepData.forEach((q: any) => {
            unified.push({
              id: q.id,
              slug: q.slug,
              title: REFINED_TITLES[q.slug] || q.title_en || q.title_pt,
              description: q.description_en || q.description_pt,
              estimated_time: q.estimated_time || 10,
              is_premium: true,
              type: "deep",
              theme: q.theme || "emotions",
            });
          });
        }

        setQuizzes(unified);
      } catch (err) {
        console.error("Error fetching journeys:", err);
      } finally {
        setLoadingQuizzes(false);
      }
    };

    fetchAllData();
  }, []);

  const handleStart = (quiz: UnifiedQuiz) => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (quiz.type === "deep") {
      if (!isPremium) {
        navigate("/pro");
      } else {
        setActiveDeepAssessment(quiz);
      }
      return;
    }

    navigate(`/quiz/${quiz.slug}`);
  };

  const filteredThemes = THEMES.filter(theme => {
    const themeQuizzes = quizzes.filter(q => q.theme === theme.slug);
    if (themeQuizzes.length === 0) return false;

    if (!search) return true;

    const matchesDim = theme.name.toLowerCase().includes(search.toLowerCase());
    const matchesQuizzes = themeQuizzes.some(q =>
      q.title.toLowerCase().includes(search.toLowerCase()) ||
      q.description.toLowerCase().includes(search.toLowerCase())
    );

    return matchesDim || matchesQuizzes;
  });

  return (
    <div className="flex min-h-screen flex-col">
      <SEOHead 
        title="Discovery Directory | ValidZen"
        description="Choose your pathway to self-mastery with our clinical-grade emotional mapping tools."
      />
      <Header />
      
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background py-16 md:py-24">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl opacity-50" />
          <div className="container relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto max-w-3xl text-center"
            >
              <Badge variant="outline" className="mb-6 border-secondary/30 text-secondary bg-secondary/5 px-4 py-1 font-black uppercase tracking-[0.2em] text-[10px]">
                <Sparkles className="mr-2 h-3.5 w-3.5" />
                Step 1: Map Your Emotions
              </Badge>
              <h1 className="mb-6 text-4xl font-black tracking-tight text-title md:text-7xl italic">
                Discovery Directory
              </h1>
              <p className="mb-10 text-lg text-muted-foreground md:text-xl italic">
                Choose a pathway below to start your journey of self-mastery and emotional clarity.
              </p>
              
              <div className="relative mx-auto max-w-md">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="Search by theme or discovery..."
                  className="h-14 pl-12 rounded-full border-border/50 bg-background shadow-2xl shadow-primary/5 ring-secondary/20 focus-visible:ring-secondary transition-all italic"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </motion.div>
          </div>
        </section>

        <section className="container py-12 md:py-20 relative">
          {(!loadingQuizzes && isLocked) && (
            <div className="absolute inset-x-0 z-40 flex items-start justify-center pt-20 pointer-events-none min-h-[600px]">
              <div className="sticky top-[30vh] max-w-lg w-full bg-card/95 border border-secondary/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] rounded-[2.5rem] p-12 text-center pointer-events-auto mx-4 backdrop-blur-md">
                <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
                  <Lock className="h-8 w-8" />
                </div>
                <h2 className="text-3xl font-black mb-4 italic">{lockType === "login" ? "Unlock Your Directory" : "Discovery Limit Reached"}</h2>
                <p className="text-muted-foreground mb-10 text-lg italic leading-relaxed">
                  {lockType === "login" 
                    ? "We’ve gathered these insights for members. Create your free account or unlock PRO for clinical-grade diagnostics."
                    : "You've reached your free discovery limit. Subscribe to PRO for unlimited access and full self-mastery blueprints!"
                  }
                </p>
                <div className="flex flex-col gap-4">
                  <Button asChild size="lg" variant="hero" className="py-8 text-xl shadow-2xl shadow-secondary/20 font-black uppercase tracking-widest rounded-full">
                    <Link to={user ? "/pro" : "/login"}>
                      {user ? "Upgrade to PRO" : "Begin Free Journey"}
                    </Link>
                  </Button>
                  {lockType === "login" && (
                    <Button asChild variant="link" className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest">
                       <Link to="/login">I already have an account</Link>
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
                  <Skeleton className="h-8 w-64" />
                  <Skeleton className="h-32 w-full rounded-2xl" />
                </div>
              ))}
            </div>
          ) : (
            <div className={cn("space-y-24 transition-all duration-700", isLocked && "pointer-events-none select-none blur-sm grayscale opacity-30")}>
              {filteredThemes.map((theme, idx) => {
                const themeQuizzes = quizzes.filter(q => q.theme === theme.slug);
                const simpleOnes = themeQuizzes.filter(q => q.type === "simple");
                const deepOne = themeQuizzes.find(q => q.type === "deep");

                return (
                  <motion.div
                    key={theme.slug}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <div className="mb-10 flex items-center justify-between">
                      <div className="flex items-center gap-5">
                        <div className="flex h-16 w-16 items-center justify-center rounded-[1.25rem] bg-secondary/10 text-3xl shadow-inner">
                          {theme.icon}
                        </div>
                        <div>
                          <h2 className="text-3xl font-black tracking-tight text-title italic">{theme.name}</h2>
                          <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground opacity-70">
                            {themeQuizzes.length} Pathways Available
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-8">
                      <div className="grid gap-6 sm:grid-cols-2">
                        {simpleOnes.map(quiz => (
                          <Card 
                            key={quiz.id} 
                            className="group relative overflow-hidden border-border bg-card transition-all hover:border-secondary/30 hover:shadow-xl hover:-translate-y-1"
                          >
                            <CardContent className="p-8">
                              <div className="mb-4 flex items-center justify-between">
                                 <Badge variant="secondary" className="bg-muted/50 text-muted-foreground text-[10px] font-black uppercase tracking-widest px-3 py-1">
                                   Core Insight
                                 </Badge>
                                 <span className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                   <Clock className="h-3.5 w-3.5" />
                                   {quiz.estimated_time} Min
                                 </span>
                              </div>
                              <h3 className="mb-3 text-xl font-black text-title group-hover:text-secondary transition-colors italic">
                                {quiz.title}
                              </h3>
                              <p className="mb-8 text-sm text-balance text-muted-foreground line-clamp-2 italic opacity-80 leading-relaxed">
                                {quiz.description}
                              </p>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="w-full justify-between bg-muted/20 group-hover:bg-secondary group-hover:text-white transition-all py-6 px-6 font-black uppercase text-[10px] tracking-widest rounded-xl"
                                onClick={() => handleStart(quiz)}
                              >
                                Begin Journey
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
  
                      {deepOne && (
                        <Card 
                          className="group relative overflow-hidden border-secondary/20 bg-gradient-to-r from-secondary/5 via-card to-background shadow-xl ring-1 ring-secondary/10 rounded-[2rem]"
                        >
                          <CardContent className="flex flex-col lg:flex-row p-10 items-center gap-10">
                            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-[2rem] bg-secondary/10 text-secondary shadow-inner">
                              <Crown className="h-12 w-12 text-secondary" />
                            </div>
                            
                            <div className="flex-1 text-center lg:text-left">
                              <div className="mb-4 flex flex-wrap items-center justify-center lg:justify-start gap-5">
                                <Badge variant="secondary" className="bg-secondary text-white border-none text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5">
                                  PRO Blueprint
                                </Badge>
                                <span className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] flex items-center gap-2">
                                  <div className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
                                  Deep Pattern Analysis
                                </span>
                              </div>
                              <h3 className="mb-3 text-3xl font-black tracking-tight text-title italic">
                                {deepOne.title}
                              </h3>
                              <p className="max-w-2xl text-md leading-relaxed text-muted-foreground italic">
                                "{deepOne.description}"
                              </p>
                            </div>
 
                            <div className="flex flex-col gap-6 min-w-[240px] w-full lg:w-auto">
                              <div className="flex items-center justify-center lg:justify-start gap-8">
                                <div className="flex items-center gap-2.5 text-[10px] font-black uppercase tracking-widest text-title">
                                  <Clock className="h-4 w-4 text-secondary" />
                                  <span>{deepOne.estimated_time} Min</span>
                                </div>
                                <div className="flex items-center gap-2.5 text-[10px] font-black uppercase tracking-widest text-title">
                                  <Lock className="h-4 w-4 text-secondary" />
                                  <span>Clinical</span>
                                </div>
                              </div>
                              <Button 
                                className="w-full bg-secondary text-white shadow-2xl shadow-secondary/30 hover:bg-secondary/90 hover:scale-105 transition-all transform active:scale-95 py-8 font-black text-lg uppercase tracking-widest rounded-full"
                                onClick={() => handleStart(deepOne)}
                              >
                                Embark Now
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
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-muted">
                    <Search className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-2xl font-black text-title italic">
                    Discovery not found
                  </h3>
                  <p className="text-muted-foreground italic">
                    Try searching for different terms or pathways.
                  </p>
                  <Button variant="link" onClick={() => setSearch("")} className="mt-4 text-secondary font-black uppercase text-[10px] tracking-widest">
                    Clear Search
                  </Button>
                </div>
              )}
            </div>
          )}
        </section>

        <Dialog 
          open={!!activeDeepAssessment} 
          onOpenChange={(open) => !open && setActiveDeepAssessment(null)}
        >
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2rem]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black italic">{activeDeepAssessment?.title}</DialogTitle>
              <DialogDescription className="italic text-md">{activeDeepAssessment?.description}</DialogDescription>
            </DialogHeader>
            {activeDeepAssessment && (
              <div className="mt-6">
                <PremiumAssessmentFlow
                  assessmentSlug={activeDeepAssessment.slug}
                  onComplete={() => {
                    setActiveDeepAssessment(null);
                    navigate("/dashboard");
                  }}
                />
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
      
      <Footer />
    </div>
  );
};

export default QuizzesPage;
