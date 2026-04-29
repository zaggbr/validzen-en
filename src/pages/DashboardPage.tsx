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
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  ArrowLeft, 
  ArrowRight,
  Lock, 
  Sparkles, 
  ChevronRight, 
  History as HistoryIcon,
  Crown,
  RotateCcw,
  Trash2
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import PremiumGate from "@/components/PremiumGate";
import { useLatestResult, useProgressOverTime, usePremiumResults } from "@/hooks/useDashboard";
import { useDeleteQuizResult, useResetQuizMap, useQuizzes } from "@/hooks/useQuiz";
import { usePosts } from "@/hooks/usePosts";
import { useDimensions } from "@/hooks/useDimensions";
import { getTopDimensions, generateInterpretation } from "@/lib/quizInsights";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const DashboardPage = () => {
  const { data: latestResult, results, isLoading: loadingResults } = useLatestResult();
  const { data: premiumResults = [], isLoading: loadingPremium } = usePremiumResults();
  const evolutionData = useProgressOverTime();
  const { data: allPosts = [] } = usePosts();
  const { data: dimensions = [], isLoading: loadingDims } = useDimensions();
  const { data: quizzes = [] } = useQuizzes();
  const { isPremium, user } = useAuth();

  const isLoading = (isPremium && loadingResults) || loadingDims || loadingPremium;
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
          const pct = Math.min(Math.round((parsed / 70) * 100), 99);
          setPremiumProgress(pct);
        }
      } catch {
        // fail silently
      }
    }
  }, [isPremium, latestPremium]);

  const mockResults = [
    { dimension: "anxiety", label: "Anxiety", score: 45, severity: "Moderate", emoji: "🧘", severityColor: "bg-blue-100 text-blue-700", interpretation: "We've gathered your insights on your stress responses." },
    { dimension: "burnout", label: "Burnout", score: 82, severity: "High", emoji: "🔥", severityColor: "bg-red-100 text-red-700", interpretation: "Your energy levels indicate a significant need for recovery." },
    { dimension: "relationships", label: "Relationships", score: 37, severity: "Mild", emoji: "💬", severityColor: "bg-emerald-100 text-emerald-700", interpretation: "Your connections appear stable and supportive." },
    { dimension: "meaning", label: "Purpose", score: 68, severity: "Moderate", emoji: "🧭", severityColor: "bg-amber-100 text-amber-700", interpretation: "You are actively exploring your sense of direction." },
    { dimension: "identity", label: "Identity", score: 52, severity: "Moderate", emoji: "👤", severityColor: "bg-indigo-100 text-indigo-700", interpretation: "Your self-perception is currently in an evolving phase." },
  ];

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <div className="container py-10 md:py-16 space-y-6">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-[360px] w-full" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const aggregateResults = () => {
    if (isSimulacrum) return mockResults;
    
    const latestByQuiz: Record<string, any> = {};
    (results || []).forEach(r => {
      if (!latestByQuiz[r.quiz_slug]) {
        latestByQuiz[r.quiz_slug] = r;
      }
    });

    const resultsMap: Record<string, any> = {};
    
    Object.values(latestByQuiz).forEach((r: any) => {
      if (!r.scores) return;
      
      Object.entries(r.scores).forEach(([slug, score]: [string, any]) => {
        const dim = dimensions.find(d => d.slug === slug);
        if (!dim) return;

        if (!resultsMap[slug] || new Date(r.completed_at) > new Date(resultsMap[slug].completedAt)) {
          resultsMap[slug] = {
            dimension: slug,
            label: dim.name_en || dim.name_pt,
            score,
            severity: score <= 33 ? "Mild" : 
                       score <= 66 ? "Moderate" : 
                       "High",
            emoji: dim.icon,
            severityColor: score <= 33 ? "bg-accent/10 text-accent" : 
                            score <= 66 ? "bg-secondary/10 text-secondary" : 
                            "bg-destructive/10 text-destructive",
            interpretation: score <= 33 ? dim.interpretation_low_en :
                            score <= 66 ? dim.interpretation_moderate_en :
                            dim.interpretation_high_en,
            resultId: r.id,
            quizSlug: r.quiz_slug,
            completedAt: r.completed_at
          };
        }
      });
    });

    return Object.values(resultsMap);
  };

  const top = latestResult ? getTopDimensions(latestResult.scores, dimensions, "en") : [];
  const mosaic = aggregateResults();
  const interpretation = latestResult ? generateInterpretation(top, "en") : "";

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
    { id: "mock-1", quiz_slug: "general", completed_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
  ] : [];

  const displayResults = isSimulacrum ? mockHistory : results;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container py-10 md:py-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
            <Link to="/quizzes" className="mb-8 inline-flex items-center gap-1.5 text-sm font-bold text-muted-foreground hover:text-secondary transition-colors uppercase tracking-widest">
              <ArrowLeft className="h-4 w-4" /> Back to Journeys
            </Link>
            <h1 className="mt-4 mb-1 text-3xl font-bold text-title md:text-5xl tracking-tight">Your Personal Blueprint</h1>
            <p className="text-md text-muted-foreground">We’ve gathered your insights to help you track your psychological agency.</p>
          </motion.div>

          {!isPremium && (
            <div className="mb-12 rounded-2xl border border-secondary/20 bg-gradient-to-r from-secondary/5 to-primary/5 p-8 flex flex-col sm:flex-row items-center gap-6 shadow-sm">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-secondary text-white shadow-lg shadow-secondary/20">
                <Lock className="h-6 w-6" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <p className="font-bold text-title text-lg">
                  This is a demonstration of your Insight Blueprint
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Subscribe to PRO to unlock your real data and track your journey toward self-mastery.
                </p>
              </div>
              <Button size="lg" variant="hero" asChild className="shrink-0 px-8 shadow-xl shadow-secondary/20">
                <Link to={user ? "/pro" : "/login"}>
                  {user ? "Unlock My Full Blueprint" : "Create My Account"}
                </Link>
              </Button>
            </div>
          )}

          {isPremium && (
            <div className="mb-16">
              <h2 className="mb-8 text-2xl font-bold text-title flex items-center gap-3">
                <Crown className="h-7 w-7 text-secondary" /> 
                Your Deep Patterns
              </h2>
              
              {!premiumResults || premiumResults.length === 0 ? (
                <div className="rounded-3xl border border-secondary/20 bg-secondary/5 p-10 text-center max-w-2xl mx-auto shadow-inner">
                  <h3 className="text-2xl font-bold text-title mb-4">
                    Deep Journey Pending
                  </h3>
                  <p className="text-muted-foreground mb-8 text-balance leading-relaxed">
                    You haven't embarked on your Deep Journey yet. This analysis reveals your dominant personality patterns and core character traits.
                  </p>
                  
                  {premiumProgress > 0 && (
                    <div className="max-w-sm mx-auto mb-10">
                       <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest mb-2">
                          <span className="text-secondary">Current Progress</span>
                          <span className="text-title">{premiumProgress}%</span>
                       </div>
                       <Progress value={premiumProgress} className="h-1.5 bg-secondary/10" />
                    </div>
                  )}

                  <Button size="lg" variant="hero" asChild className="px-10 py-7 text-lg shadow-2xl shadow-secondary/30">
                    <Link to="/quiz/deep-assessment">
                      Start My Deep Journey <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {premiumResults.map((p, idx) => (
                    <motion.div 
                      key={p.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <Card className="group relative overflow-hidden h-full border-secondary/20 bg-gradient-to-br from-secondary/5 to-primary/5 hover:border-secondary transition-all shadow-sm hover:shadow-xl">
                        <CardContent className="p-8">
                          <div className="mb-6 flex items-center justify-between">
                            <div className="h-12 w-12 rounded-2xl bg-secondary/20 flex items-center justify-center text-secondary">
                              <Crown className="h-6 w-6" />
                            </div>
                            <Badge variant="secondary" className="bg-secondary text-white uppercase text-[10px] font-bold tracking-widest px-3 py-1">
                              PRO ANALYSIS
                            </Badge>
                          </div>
                          
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary/60 mb-2">
                            Deep Pattern Analysis
                          </p>

                          <h3 className="text-xl font-bold text-title mb-3">
                            {p.interpretation?.profile_name || "Pattern Archetype"}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-6 line-clamp-3 leading-relaxed">
                            {p.summary || "A comprehensive analysis of your character traits and psychological agency."}
                          </p>
                          
                          <div className="flex items-center justify-between mt-auto pt-6 border-t border-secondary/10">
                            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                              {new Date(p.completed_at).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                            <Button asChild variant="link" size="sm" className="p-0 h-auto text-secondary font-bold text-xs uppercase tracking-wider">
                              <Link to={`/result/${p.id}`}>View Blueprint</Link>
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

          <div className="mb-16">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-3xl font-bold text-title">Your Discovery Map</h2>
              {isSimulacrum && (
                <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/20 font-bold uppercase text-[10px] tracking-[0.2em] px-4 py-1.5">
                  Simulation Mode
                </Badge>
              )}
            </div>
            
            <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {mosaic.map((item: any, i) => (
                <motion.div 
                  key={item.dimension} 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className={cn(
                    "group relative h-full overflow-hidden border-border/50 transition-all hover:shadow-2xl hover:-translate-y-1",
                    i === 0 && isSimulacrum && "ring-2 ring-secondary/30 shadow-xl"
                  )}>
                    <CardContent className="p-0">
                      <div className="flex h-2.5 bg-muted/30">
                        <div 
                          className={cn("h-full transition-all duration-1000", item.dimension === 'burnout' && item.score > 70 ? 'bg-destructive' : 'bg-secondary')} 
                          style={{ width: `${item.score}%` }} 
                        />
                      </div>
                      <div className="p-8">
                        <div className="mb-6 flex items-center justify-between">
                          <span className="text-4xl">{item.emoji}</span>
                          <div className="flex items-center gap-3">
                            <span className={cn("rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest", (item as any).severityColor || "bg-muted text-muted-foreground")}>
                              {item.severity}
                            </span>
                            {!isSimulacrum && (
                              <button
                                onClick={() => {
                                  if (window.confirm('Do you really want to redo this journey? Your old blueprint will be archived.')) {
                                    deleteResult.mutate(item.quizSlug);
                                  }
                                }}
                                className="group/btn flex items-center justify-center rounded-full bg-muted/80 p-2 text-muted-foreground transition-all hover:bg-secondary hover:text-white"
                                title="Restart this Journey"
                              >
                                <RotateCcw className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                        <h3 className="mb-2 text-xl font-bold text-title">{item.label}</h3>
                        <div className="mb-6 flex items-baseline gap-1.5">
                          <span className="text-4xl font-bold text-foreground">{item.score}%</span>
                          <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em]">Intensity</span>
                        </div>
                        <p className="text-sm leading-relaxed text-muted-foreground opacity-90">
                          "{item.interpretation}"
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mb-16">
            <h2 className="mb-6 text-2xl font-bold text-title flex items-center gap-3">
              <HistoryIcon className="h-7 w-7 text-secondary" /> History of Your Journeys
            </h2>
            <Card className={cn("overflow-hidden border-border shadow-sm", isSimulacrum && "opacity-60 pointer-events-none")}>
              <CardContent className="p-0">
                {!displayResults || displayResults.length === 0 ? (
                   <div className="py-16 text-center">
                     <p className="text-md text-muted-foreground mb-4">You haven't started any journeys yet.</p>
                     <Button variant="hero" asChild>
                        <Link to="/quizzes">Begin My First Journey</Link>
                     </Button>
                   </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-muted/30 border-b border-border">
                        <tr>
                          <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Journey</th>
                          <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Date Completed</th>
                          <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {displayResults.slice(0, 5).map((r) => (
                          <tr key={r.id} className="hover:bg-muted/10 transition-colors">
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                                  {(r.quiz_slug || 'J').charAt(0).toUpperCase()}
                                </div>
                                <span className="text-md font-bold text-title">
                                  {r.quiz_slug === "general" 
                                    ? "Your Core Journey" 
                                    : (quizzes.find(q => q.slug === r.quiz_slug)?.title || r.quiz_slug.replace(/-/g, ' '))}
                                </span>
                              </div>
                            </td>
                            <td className="px-8 py-6 text-sm text-muted-foreground">
                              {new Date(r.completed_at).toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' })}
                            </td>
                            <td className="px-8 py-6 text-right">
                              <Button asChild variant="ghost" size="sm" className="text-secondary font-bold uppercase tracking-widest text-[10px] hover:bg-secondary/10">
                                <Link to={`/result/${r.id}`}>
                                  View Blueprint <ChevronRight className="ml-1 h-3 w-3" />
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
            <div className="mb-16">
              <h2 className="mb-6 text-2xl font-bold text-title flex items-center gap-3">📚 Guided Wisdom</h2>
              <div className="grid gap-6 sm:grid-cols-2">
                {recommendedPosts.map((post) =>
                  post ? <PostCard key={post.slug} title={post.title} excerpt={post.excerpt} category={post.category} readTime={`${post.reading_time}`} slug={post.slug} /> : null
                )}
              </div>
            </div>
          )}

          <PremiumGate>
            <div className="mb-16 space-y-12 rounded-3xl border border-secondary/20 bg-gradient-to-br from-card to-secondary/5 p-10 shadow-sm">
              <div>
                <h2 className="mb-8 flex items-center gap-3 text-2xl font-bold text-title">
                  <TrendingUp className="h-7 w-7 text-secondary" /> Your Psychological Evolution
                </h2>
                <div className="h-80">
                  {evolutionData.length > 1 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={evolutionData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                        <XAxis dataKey="date" tick={{ fontSize: 10, fontWeight: 'bold' }} stroke="hsl(var(--muted-foreground))" />
                        <YAxis domain={[0, 100]} tick={{ fontSize: 10, fontWeight: 'bold' }} stroke="hsl(var(--muted-foreground))" />
                        <Legend wrapperStyle={{ paddingTop: '20px', fontWeight: 'bold', fontSize: '12px' }} />
                        {dimensionKeys.slice(0, 3).map((key, i) => {
                          const d = dimMap.get(key);
                          const name = d ? d.name_en : key;
                          return (
                            <Line
                              key={key}
                              type="monotone"
                              dataKey={key}
                              name={name}
                              stroke={i === 0 ? "hsl(var(--destructive))" : i === 1 ? "hsl(var(--secondary))" : "hsl(var(--primary))"}
                              strokeWidth={3}
                              dot={{ r: 4, strokeWidth: 2 }}
                              activeDot={{ r: 6 }}
                            />
                          );
                        })}
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center border-2 border-dashed border-border rounded-2xl">
                       <p className="text-sm text-muted-foreground">Embark on more Journeys to visualize your evolution chart.</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h2 className="mb-6 text-xl font-bold text-title flex items-center gap-3">
                  <Sparkles className="h-6 w-6 text-secondary" /> Personal Insights
                </h2>
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {dimensions.slice(0, 3).map((dim) => (
                    <Card key={dim.slug} className="bg-card/50 border-border/50 hover:border-secondary/30 transition-all">
                      <CardContent className="p-6">
                        <span className="text-3xl mb-4 block">{dim.icon}</span>
                        <h4 className="text-md font-bold text-title mb-2">{dim.name_en}</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">Deep analysis of your internal agency in this dimension.</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-6 sm:flex-row">
                <Card className="flex-1 transition-all hover:border-secondary/40 group cursor-pointer shadow-sm hover:shadow-xl">
                  <CardContent className="p-8 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/10 text-secondary transition-all group-hover:scale-110">
                       <span className="text-3xl">📄</span>
                    </div>
                    <h4 className="text-lg font-bold text-title mb-2">Export Personal Blueprint</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">Download your complete clinical-grade analysis in PDF format.</p>
                  </CardContent>
                </Card>
                <Card className="flex-1 transition-all hover:border-secondary/40 group cursor-pointer shadow-sm hover:shadow-xl">
                  <CardContent className="p-8 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/10 text-secondary transition-all group-hover:scale-110">
                       <span className="text-3xl">📅</span>
                    </div>
                    <h4 className="text-lg font-bold text-title mb-2">30-Day Growth Plan</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">A personalized daily guide designed to restore your self-mastery.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </PremiumGate>

          {isPremium && (
            <div className="mt-16 flex flex-col items-center border-t border-border pt-16 pb-8">
               <h3 className="text-xl font-bold text-title mb-3">
                 Seeking a fresh perspective?
               </h3>
               <p className="text-sm text-muted-foreground mb-8 text-center max-w-md leading-relaxed">
                 Resetting will permanently archive all your progress, including journey history and deep pattern blueprints.
               </p>
               <Button 
                variant="outline" 
                size="lg" 
                className="text-destructive border-destructive/20 hover:bg-destructive/10 px-10 py-7 font-bold uppercase tracking-[0.2em] text-[10px]"
                onClick={() => {
                  if (window.confirm("Attention: This will permanently archive all your progress. This action cannot be undone. Continue?")) {
                    resetMap.mutate();
                  }
                }}
               >
                 <Trash2 className="mr-2 h-4 w-4" />
                 Reset My Discovery Map
               </Button>
            </div>
          )}

          <div className="mx-auto max-w-xl opacity-70">
            <Disclaimer />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DashboardPage;
