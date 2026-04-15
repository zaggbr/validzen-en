import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Disclaimer from "@/components/Disclaimer";
import PostCard from "@/components/PostCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  ArrowLeft, 
  Lock, 
  Sparkles, 
  ChevronRight, 
  User, 
  History as HistoryIcon,
  Crown,
  Info,
  RotateCcw,
  Trash2
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import PremiumGate from "@/components/PremiumGate";
import { useLatestResult, useProgressOverTime, usePremiumResults } from "@/hooks/useDashboard";
import { useDeleteQuizResult, useResetQuizMap } from "@/hooks/useQuiz";
import { usePosts } from "@/hooks/usePosts";
import { useDimensions } from "@/hooks/useDimensions";
import { getTopDimensions, generateInterpretation } from "@/lib/quizInsights";
import { useI18n } from "@/i18n/I18nContext";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const DashboardPage = () => {
  const { data: latestResult, results, isFetching: fetchingResults, isLoading: loadingResults } = useLatestResult();
  const { data: premiumResults = [], isLoading: loadingPremium } = usePremiumResults();
  const evolutionData = useProgressOverTime();
  const { t, locale, localePath } = useI18n();
  const { data: allPosts = [] } = usePosts(locale);
  const { data: dimensions = [], isLoading: loadingDims } = useDimensions();
  const { isPremium, user } = useAuth();

  const isLoading = (isPremium && (loadingResults || fetchingResults)) || loadingDims || loadingPremium;
  const isSimulacrum = !isPremium || !latestResult;
  const latestPremium = premiumResults.length > 0 ? premiumResults[0] : null;

  const deleteResult = useDeleteQuizResult();
  const resetMap = useResetQuizMap();
  const [premiumProgress, setPremiumProgress] = useState(0);

  useEffect(() => {
    if (isPremium && !latestPremium) {
      try {
        const saved = localStorage.getItem("premium_progress_teste-profundo");
        if (saved) {
          const parsed = Object.keys(JSON.parse(saved)).length;
          // As assumimos ~70 questões como base para a barra de progresso visual
          const pct = Math.min(Math.round((parsed / 70) * 100), 99);
          setPremiumProgress(pct);
        }
      } catch {
        // fail silently
      }
    }
  }, [isPremium, latestPremium]);

  // Mock data for simulacrum — 8 diverse emotional dimensions to show the full map
  const mockResults = [
    { dimension: "ansiedade", label: locale === "pt" ? "Ansiedade" : "Anxiety", score: 45, severity: locale === "pt" ? "Leve" : "Mild", emoji: "🧘", color: "bg-blue-500", severityColor: "bg-blue-100 text-blue-700", interpretation: locale === "pt" ? "Níveis controlados, mas observe picos de estresse." : "Controlled levels, but watch for stress spikes." },
    { dimension: "burnout", label: locale === "pt" ? "Burnout" : "Burnout", score: 82, severity: locale === "pt" ? "Alto" : "High", emoji: "🔥", color: "bg-red-500", severityColor: "bg-red-100 text-red-700", interpretation: locale === "pt" ? "Risco elevado detectado. Recomendamos pausa imediata." : "High risk detected. Immediate break recommended." },
    { dimension: "relacoes", label: locale === "pt" ? "Relações" : "Relationships", score: 37, severity: locale === "pt" ? "Leve" : "Mild", emoji: "💬", color: "bg-emerald-500", severityColor: "bg-emerald-100 text-emerald-700", interpretation: locale === "pt" ? "Vínculos saudáveis, com oportunidade de aprofundamento." : "Healthy bonds, with opportunity to deepen." },
    { dimension: "sentido", label: locale === "pt" ? "Sentido" : "Purpose", score: 68, severity: locale === "pt" ? "Moderado" : "Moderate", emoji: "🧭", color: "bg-amber-500", severityColor: "bg-amber-100 text-amber-700", interpretation: locale === "pt" ? "Há uma busca ativa por significado. Explore novos caminhos." : "There is an active search for meaning. Explore new paths." },
    { dimension: "identidade", label: locale === "pt" ? "Identidade" : "Identity", score: 52, severity: locale === "pt" ? "Moderado" : "Moderate", emoji: "👤", color: "bg-indigo-500", severityColor: "bg-indigo-100 text-indigo-700", interpretation: locale === "pt" ? "Sua percepção de si está em evolução. Continue explorando." : "Your self-perception is evolving. Keep exploring." },
    { dimension: "emocoes", label: locale === "pt" ? "Emoções" : "Emotions", score: 59, severity: locale === "pt" ? "Moderado" : "Moderate", emoji: "🎭", color: "bg-pink-500", severityColor: "bg-pink-100 text-pink-700", interpretation: locale === "pt" ? "Equilíbrio emocional estável com pequenos desvios." : "Stable emotional balance with minor deviations." },
    { dimension: "ia_futuro", label: locale === "pt" ? "IA e Futuro" : "AI & Future", score: 71, severity: locale === "pt" ? "Alto" : "High", emoji: "🤖", color: "bg-cyan-500", severityColor: "bg-cyan-100 text-cyan-700", interpretation: locale === "pt" ? "Preocupação elevada com o futuro tecnológico." : "High concern about the technological future." },
    { dimension: "sociedade", label: locale === "pt" ? "Sociedade" : "Society", score: 64, severity: locale === "pt" ? "Moderado" : "Moderate", emoji: "🌍", color: "bg-stone-500", severityColor: "bg-stone-100 text-stone-700", interpretation: locale === "pt" ? "Sensibilidade aguçada às mudanças sociais." : "Arp sensitivity to social changes." },
  ];

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <div className="container py-10 md:py-16 space-y-6">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-[360px] w-full" />
            <div className="grid gap-4 sm:grid-cols-3">
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Aggregate results: For each unique quiz_slug, find the latest submission
  const aggregateResults = () => {
    if (isSimulacrum) return mockResults;
    
    // Group results by quiz_slug, keeping only the absolute latest for each
    const latestByQuiz: Record<string, any> = {};
    (results || []).forEach(r => {
      if (!latestByQuiz[r.quiz_slug]) {
        latestByQuiz[r.quiz_slug] = r;
      }
    });

    const resultsMap: Record<string, any> = {};
    
    // Convert quiz results into dimension scores for the mosaic
    Object.values(latestByQuiz).forEach((r: any) => {
      if (!r.scores) return;
      
      Object.entries(r.scores).forEach(([slug, score]: [string, any]) => {
        const dim = dimensions.find(d => d.slug === slug);
        if (!dim) return;

        // Only update if this result is newer than what we already found for this dimension
        if (!resultsMap[slug] || new Date(r.completed_at) > new Date(resultsMap[slug].completedAt)) {
          resultsMap[slug] = {
            dimension: slug,
            label: locale === "en" ? dim.name_en : dim.name_pt,
            score,
            severity: score <= 33 ? (locale === 'pt' ? "Leve" : "Mild") : 
                       score <= 66 ? (locale === 'pt' ? "Moderado" : "Moderate") : 
                       (locale === 'pt' ? "Alto" : "High"),
            emoji: dim.icon,
            severityColor: score <= 33 ? "bg-blue-100 text-blue-700" : 
                            score <= 66 ? "bg-amber-100 text-amber-700" : 
                            "bg-red-100 text-red-700",
            interpretation: score <= 33 ? (locale === 'en' ? dim.interpretation_low_en : dim.interpretation_low_pt) :
                            score <= 66 ? (locale === 'en' ? dim.interpretation_moderate_en : dim.interpretation_moderate_pt) :
                            (locale === 'en' ? dim.interpretation_high_en : dim.interpretation_high_pt),
            resultId: r.id,
            quizSlug: r.quiz_slug,
            completedAt: r.completed_at
          };
        }
      });
    });

    return Object.values(resultsMap);
  };

  const top = latestResult ? getTopDimensions(latestResult.scores, dimensions, locale) : [];
  const mosaic = aggregateResults();
  const interpretation = latestResult ? generateInterpretation(top, locale) : "";

  const recommendedSlugs = (latestResult?.recommended_post_slugs?.length ?? 0) > 0
    ? (latestResult?.recommended_post_slugs ?? [])
    : dimensions
        .filter((d) => top.some((t) => t.dimension === d.slug))
        .flatMap((d) => d.recommended_post_slugs)
        .slice(0, 4);

  const recommendedPosts = recommendedSlugs
    .map((s) => allPosts.find((p) => p.slug === s))
    .filter(Boolean);

  const dimMap = new Map(dimensions.map((d) => [d.slug, d]));

  const dimensionKeys = evolutionData.length > 0
    ? Object.keys(evolutionData[0]).filter((k) => k !== "date")
    : [];

  const mockHistory = isSimulacrum ? [
    { id: "mock-1", quiz_slug: "geral", completed_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    { id: "mock-2", quiz_slug: "ansiedade", completed_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
    { id: "mock-3", quiz_slug: "burnout", completed_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString() },
  ] : [];

  const displayResults = isSimulacrum ? mockHistory : results;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container py-10 md:py-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
            <Link to={localePath("/")} className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-secondary transition-colors">
              <ArrowLeft className="h-4 w-4" /> {t("quiz.back")}
            </Link>
            <h1 className="mt-4 mb-1 text-3xl font-bold text-title md:text-4xl">🧭 {t("dashboard.title")}</h1>
            <p className="text-sm text-muted-foreground">{t("dashboard.subtitle")}</p>
          </motion.div>

          {!isPremium && (
            <div className="mb-8 rounded-2xl border border-secondary/20 bg-gradient-to-r from-secondary/5 to-primary/5 p-6 flex flex-col sm:flex-row items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                <Lock className="h-5 w-5" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <p className="font-semibold text-title text-sm">
                  {locale === "pt" ? "Você está vendo uma demonstração do seu Mapa Emocional" : "You are viewing a demo of your Emotional Map"}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {locale === "pt" ? "Assine o PRO para ver seus dados reais e acompanhar sua evolução." : "Subscribe to PRO to see your real data and track your evolution."}
                </p>
              </div>
              <Button size="sm" variant="hero" asChild className="shrink-0">
                <Link to={localePath(user ? "/pro" : "/login")}>
                  {user ? t("pro.upgrade_cta") : t("result.create_account")}
                </Link>
              </Button>
            </div>
          )}

          {isPremium && (
            <div className="mb-12">
              <h2 className="mb-6 text-2xl font-bold text-title flex items-center gap-2">
                <Crown className="h-6 w-6 text-secondary" /> 
                {locale === "pt" ? "Seus Perfis Profundos" : "Your Deep Profiles"}
              </h2>
              
              {!premiumResults || premiumResults.length === 0 ? (
                <div className="rounded-2xl border border-secondary/20 bg-secondary/5 p-8 text-center max-w-2xl mx-auto">
                  <h3 className="text-xl font-bold text-title mb-4">
                    {locale === "pt" ? "Mergulho Aprofundado Pendente" : "Deep Dive Pending"}
                  </h3>
                  <p className="text-muted-foreground mb-8 text-balance">
                    {locale === "pt" 
                      ? "Você ainda não completou o seu Assessment Profundo. Este teste revela o seu Padrão Primário de Personalidade e Traços de Caráter." 
                      : "You haven't completed your Deep Assessment yet. This test reveals your Primary Personality Pattern and Character Traits."}
                  </p>
                  
                  {premiumProgress > 0 && (
                    <div className="max-w-sm mx-auto mb-8">
                       <div className="flex justify-between text-xs mb-2">
                          <span className="font-bold text-secondary">{locale === "pt" ? "Progresso Atual" : "Current Progress"}</span>
                          <span className="font-bold">{premiumProgress}%</span>
                       </div>
                       <Progress value={premiumProgress} className="h-2 bg-secondary/10" />
                    </div>
                  )}

                  <Button size="lg" variant="hero" asChild>
                    <Link to={localePath("/quiz/teste-profundo")}>
                      {locale === "pt" ? "Começar Agora" : "Start Now"} <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {premiumResults.map((p, idx) => (
                    <motion.div 
                      key={p.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <Card className="group relative overflow-hidden h-full border-secondary/20 bg-gradient-to-br from-secondary/5 to-primary/5 hover:border-secondary transition-all">
                        <CardContent className="p-6">
                          <div className="mb-4 flex items-center justify-between">
                            <div className="h-10 w-10 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary">
                              <Crown className="h-5 w-5" />
                            </div>
                            <Badge variant="secondary" className="bg-secondary text-white uppercase text-[10px]">
                              {locale === "pt" ? "Resultado PRO" : "PRO Result"}
                            </Badge>
                          </div>
                          
                          <h3 className="text-lg font-bold text-title mb-2">
                            {p.interpretation?.profile_name || (locale === "pt" ? "Perfil Profundo" : "Deep Profile")}
                          </h3>
                          <p className="text-xs text-muted-foreground mb-4 line-clamp-3 italic">
                            {p.summary || (locale === "pt" ? "Análise completa dos seus traços de caráter e funcionamento psicológico." : "Complete analysis of your character traits and psychological functioning.")}
                          </p>
                          
                          <div className="flex items-center justify-between mt-auto pt-4 border-t border-secondary/10">
                            <span className="text-[10px] text-muted-foreground font-medium italic">
                              {new Date(p.completed_at).toLocaleDateString(locale === "pt" ? "pt-BR" : "en-US")}
                            </span>
                            <Button size="sm" variant="ghost" className="text-secondary p-0 h-auto hover:bg-transparent" asChild>
                              <Link to={localePath(`/resultado/premium/${p.id}`)}>
                                {locale === "pt" ? "Ver Mapa Completo" : "View Full Map"} <ChevronRight className="ml-1 h-3 w-3" />
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="mb-12">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-title">{t("dashboard.seus_afetos")}</h2>
              {isSimulacrum && (
                <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/20">
                  {locale === "pt" ? "Modo Demonstração" : "Demo Mode"}
                </Badge>
              )}
            </div>
            
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {mosaic.map((item: any, i) => (
                <motion.div 
                  key={item.dimension} 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className={cn(
                    "group relative h-full overflow-hidden border-border/50 transition-all hover:shadow-lg",
                    i === 1 && isSimulacrum && "ring-2 ring-secondary/30 scale-[1.02] shadow-xl"
                  )}>
                    <CardContent className="p-0">
                      <div className="flex h-2 bg-muted/30">
                        <div 
                          className={cn("h-full", item.dimension === 'burnout' ? 'bg-red-500' : 'bg-secondary')} 
                          style={{ width: `${item.score}%` }} 
                        />
                      </div>
                      <div className="p-6">
                        <div className="mb-4 flex items-center justify-between">
                          <span className="text-3xl">{item.emoji}</span>
                          <div className="flex items-center gap-2">
                            <span className={cn("rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider", (item as any).severityColor || "bg-muted text-muted-foreground")}>
                              {item.severity}
                            </span>
                            {!isSimulacrum && (
                              <button
                                onClick={() => {
                                  if (window.confirm(locale === 'pt' ? 'Quer mesmo refazer? O resultado antigo será perdido.' : 'Do you really want to redo? The old result will be lost.')) {
                                    deleteResult.mutate(item.quizSlug);
                                  }
                                }}
                                className="group/btn flex items-center justify-center rounded-full bg-muted/80 p-1.5 text-muted-foreground transition-all hover:bg-secondary hover:text-white"
                                title={locale === 'pt' ? 'Refazer esse Assessment' : 'Redo this Assessment'}
                              >
                                <RotateCcw className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                        </div>
                        <h3 className="mb-1 text-lg font-bold text-title text-start">{item.label}</h3>
                        <div className="mb-4 flex items-baseline gap-1">
                          <span className="text-3xl font-black text-foreground">{item.score}%</span>
                          <span className="text-xs text-muted-foreground font-medium uppercase tracking-tighter">Intensity</span>
                        </div>
                        <p className="text-sm text-balance text-muted-foreground leading-relaxed italic text-start">
                          "{item.interpretation}"
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              {isSimulacrum && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }}
                  className="lg:col-span-1"
                >
                  <Card className="h-full bg-gradient-to-br from-secondary/10 to-primary/5 border-secondary/20 border-dashed border-2 flex flex-col items-center justify-center p-8 text-center">
                     <Crown className="h-10 w-10 text-secondary/40 mb-4" />
                     <h3 className="font-bold text-title mb-2">{locale === "pt" ? "Desbloqueie seu Mapa Completo" : "Unlock your Full Map"}</h3>
                     <p className="text-xs text-muted-foreground mb-6">
                       {locale === "pt" ? "Assine o PRO para ver seus resultados reais e acompanhar sua evolução emocional." : "Subscribe to PRO to see your real results and track your emotional evolution."}
                     </p>
                     <Button size="sm" variant="hero" asChild>
                       <Link to={localePath(user ? "/pro" : "/login")}>
                         {user ? t("pro.upgrade_cta") : t("result.create_account")}
                       </Link>
                     </Button>
                  </Card>
                </motion.div>
              )}
            </div>
          </div>

          <div className={cn("mb-12 rounded-2xl border border-border bg-muted/30 p-8", isSimulacrum && "select-none pointer-events-none opacity-60")}>
            <div className="flex items-center gap-3 mb-4">
               <div className="h-10 w-10 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary">
                 <Sparkles className="h-5 w-5" />
               </div>
               <h2 className="text-lg font-bold text-title">📝 {t("result.interpretation")}</h2>
            </div>
            <p className="text-md leading-relaxed text-muted-foreground text-start">
              {isSimulacrum 
                ? (locale === "pt" 
                    ? "Esta é uma análise detalhada baseada em seus resultados consolidados, cruzando dados de ansiedade, estresse e regulação emocional..." 
                    : "This is a detailed analysis based on your consolidated results, crossing data from anxiety, stress and emotional regulation...") 
                : interpretation}
            </p>
          </div>

          <div className="mb-12">
            <h2 className="mb-4 text-2xl font-bold text-title flex items-center gap-2">
              <HistoryIcon className="h-6 w-6 text-secondary" /> {t("dashboard.history")}
            </h2>
            <Card className={cn("overflow-hidden border-border/50", isSimulacrum && "opacity-60 pointer-events-none")}>
              <CardContent className="p-0">
                {!displayResults || displayResults.length === 0 ? (
                   <div className="py-12 text-center">
                     <p className="text-sm text-muted-foreground">{t("dashboard.no_history")}</p>
                     <Button variant="link" asChild className="mt-2 text-secondary">
                        <Link to={localePath("/quizzes")}>{t("dashboard.cta_quiz")}</Link>
                     </Button>
                   </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-muted/30 border-b border-border">
                        <tr>
                          <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Avaliação</th>
                          <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Data</th>
                          <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">Ação</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {displayResults.slice(0, 5).map((r) => (
                          <tr key={r.id} className="hover:bg-muted/10 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                                  {r.quiz_slug === "geral" ? "G" : (r.quiz_slug || 'Q').charAt(0).toUpperCase()}
                                </div>
                                <span className="text-sm font-semibold text-title">
                                  {r.quiz_slug === "geral" ? (locale === "pt" ? "Mapeamento Geral" : "General Mapping") : r.quiz_slug}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-muted-foreground">
                              {new Date(r.completed_at).toLocaleDateString(locale === "pt" ? "pt-BR" : "en-US")}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <Button asChild variant="ghost" size="sm" className="text-secondary hover:text-secondary hover:bg-secondary/10">
                                <Link to={localePath(`/resultado/${r.id}`)}>
                                  {locale === "pt" ? "Ver Detalhes" : "View Details"} <ChevronRight className="ml-1 h-3 w-3" />
                                </Link>
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {recommendedPosts.length > 0 && (
            <div className="mb-12">
              <h2 className="mb-4 text-xl font-bold text-title">📚 {t("dashboard.recommended_content")}</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {recommendedPosts.map((post) =>
                  post ? <PostCard key={post.slug} title={post.title} excerpt={post.excerpt} category={post.category} readTime={`${post.reading_time} min`} slug={post.slug} /> : null
                )}
              </div>
            </div>
          )}

          <PremiumGate>
            <div className="mb-12 space-y-8 rounded-xl border border-border p-6">
              <div>
                <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-title">
                  <TrendingUp className="h-5 w-5" />{t("dashboard.evolution")}
                </h2>
                <div className="h-64">
                  {evolutionData.length > 1 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={evolutionData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                        <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                        <Legend />
                        {dimensionKeys.slice(0, 3).map((key, i) => {
                          const d = dimMap.get(key);
                          const name = d ? (locale === "en" ? d.name_en : d.name_pt) : key;
                          return (
                            <Line
                              key={key}
                              type="monotone"
                              dataKey={key}
                              name={name}
                              stroke={i === 0 ? "hsl(var(--destructive))" : i === 1 ? "hsl(var(--secondary))" : "hsl(var(--primary))"}
                              strokeWidth={2}
                            />
                          );
                        })}
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-sm text-muted-foreground">{t("dashboard.no_history")}</p>
                  )}
                </div>
              </div>

              <div>
                <h2 className="mb-4 text-lg font-bold text-title">🔬 {t("dashboard.deep_dive")}</h2>
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {dimensions.slice(0, 6).map((dim) => (
                    <Card key={dim.slug}>
                      <CardContent className="p-4">
                        <span className="text-lg">{dim.icon}</span>
                        <h4 className="text-sm font-bold text-title">{locale === "en" ? dim.name_en : dim.name_pt}</h4>
                        <p className="text-xs text-muted-foreground">{t("dashboard.deep_dive_desc")}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Card className="flex-1 transition-all hover:border-secondary/30">
                  <CardContent className="p-5 text-center">
                    <span className="text-3xl">📄</span>
                    <h4 className="mt-2 text-sm font-bold text-title">{t("dashboard.export_pdf")}</h4>
                    <p className="text-xs text-muted-foreground">{t("dashboard.export_pdf_desc")}</p>
                  </CardContent>
                </Card>
                <Card className="flex-1 transition-all hover:border-secondary/30">
                  <CardContent className="p-5 text-center">
                    <span className="text-3xl">📅</span>
                    <h4 className="mt-2 text-sm font-bold text-title">{t("dashboard.plan_30days")}</h4>
                    <p className="text-xs text-muted-foreground">{t("dashboard.plan_30days_desc")}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </PremiumGate>

          {isPremium && (
            <div className="mt-16 flex flex-col items-center border-t border-border pt-12 pb-8">
               <h3 className="text-lg font-bold text-title mb-2">
                 {locale === "pt" ? "Deseja começar de novo?" : "Want to start over?"}
               </h3>
               <p className="text-sm text-muted-foreground mb-6 text-center max-w-md">
                 {locale === "pt" 
                   ? "A reinicialização apagará todo o seu progresso, incluindo histórico de quizzes e assessments profundos." 
                   : "Resetting will clear all your progress, including quiz history and deep assessments."}
               </p>
               <Button 
                variant="outline" 
                size="lg" 
                className="text-destructive border-destructive/20 hover:bg-destructive/5"
                onClick={() => {
                  if (window.confirm(locale === "pt" ? "Atenção: Isso zerará todo o seu progresso definitivamente. Deseja continuar?" : "Attention: This will permanently reset all your progress. Continue?")) {
                    resetMap.mutate();
                  }
                }}
               >
                 <Trash2 className="mr-2 h-4 w-4" />
                 {locale === "pt" ? "Reiniciar Meu Mapa" : "Reset My Map"}
               </Button>
            </div>
          )}

          <div className="mx-auto max-w-xl">
            <Disclaimer />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DashboardPage;
