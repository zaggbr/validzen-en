import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Disclaimer from "@/components/Disclaimer";
import PostCard from "@/components/PostCard";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import AdBanner from "@/components/AdBanner";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Share2, 
  ArrowRight, 
  UserPlus, 
  ArrowLeft, 
  Sparkles, 
  Lock,
  ChevronRight,
  ClipboardCheck
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useResultById } from "@/hooks/useDashboard";
import { usePosts } from "@/hooks/usePosts";
import { useDimensions } from "@/hooks/useDimensions";
import { getTopDimensions, generateInterpretation } from "@/lib/quizInsights";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const ResultPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: result, isLoading: loadingResult } = useResultById(id);
  const { data: allPosts = [] } = usePosts("en");
  const { data: dimensions = [], isLoading: loadingDims } = useDimensions();
  const { isPremium, user } = useAuth();

  const isLoading = loadingResult || loadingDims;

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <div className="container py-10 md:py-16">
            <div className="mb-10 text-center">
              <Skeleton className="mx-auto mb-3 h-12 w-12 rounded-full" />
              <Skeleton className="mx-auto mb-2 h-8 w-64" />
            </div>
            <Skeleton className="mx-auto h-[400px] max-w-2xl" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 flex-col items-center justify-center py-20 text-center">
          <span className="mb-4 text-5xl">🔍</span>
          <h1 className="mb-2 text-2xl font-bold text-title">Journey Not Found</h1>
          <p className="mb-6 text-sm text-muted-foreground">The journey you're looking for doesn't exist or has been archived.</p>
          <Button asChild variant="hero" size="lg">
            <Link to="/quizzes">Start a New Journey</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const top = getTopDimensions(result.scores, dimensions, "en");
  const interpretation = generateInterpretation(top, "en");

  const recommendedSlugs = (result.recommended_post_slugs?.length ?? 0) > 0
    ? result.recommended_post_slugs
    : dimensions
        .filter((d) => top.some((t) => t.dimension === d.slug))
        .flatMap((d) => d.recommended_post_slugs)
        .slice(0, 4);

  const recommendedPosts = recommendedSlugs
    .map((s) => allPosts.find((p) => p.slug === s))
    .filter(Boolean);

  const topDimension = top[0];

  const completedDate = new Date(result.completed_at).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: "My ValidZen Insight Blueprint", url });
    } else {
      await navigator.clipboard.writeText(url);
      alert("Link copied to your clipboard!");
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <SEOHead title="Your Insight Blueprint — ValidZen" description="View your personalized psychological mapping discoveries." noindex />
      <Header />
      <main className="flex-1">
        <div className="container py-10 md:py-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center">
            <Link to="/dashboard" className="mb-8 inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-secondary transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </Link>
            <br />
            <div className="mx-auto mt-6 mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-secondary/10 text-4xl shadow-inner">
              🧭
            </div>
            <h1 className="mb-2 text-4xl font-black tracking-tight text-title md:text-6xl italic">Your Discoveries</h1>
            <p className="mb-8 text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">
              Blueprint mapped on {completedDate}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button variant="outline" size="sm" onClick={handleShare} className="gap-2 rounded-full px-6 py-5 font-bold uppercase text-[10px] tracking-widest hover:bg-secondary/10 hover:text-secondary">
                <Share2 className="h-4 w-4" /> Share My Insights
              </Button>
              {isPremium && (
                <Button variant="outline" size="sm" disabled className="gap-2 rounded-full px-6 py-5 border-secondary/30 text-secondary/60 bg-secondary/5 cursor-not-allowed font-bold uppercase text-[10px] tracking-widest">
                   <ClipboardCheck className="h-4 w-4" /> PDF Blueprint (Coming soon)
                </Button>
              )}
            </div>
          </motion.div>

          <div className="mx-auto mb-20 max-w-4xl">
            <div className="grid gap-8 md:grid-cols-2">
              {top.slice(0, 4).map((item, i) => (
                <motion.div 
                  key={item.dimension} 
                  initial={{ opacity: 0, scale: 0.95 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className={cn(
                    "h-full overflow-hidden border-border transition-all hover:shadow-2xl hover:-translate-y-1",
                    i === 0 && "ring-2 ring-secondary/20 shadow-xl shadow-secondary/5"
                  )}>
                    <CardContent className="p-0">
                      <div className="h-2 bg-muted/30">
                        <div 
                          className="h-full bg-secondary transition-all duration-1000 ease-out" 
                          style={{ width: `${item.score}%` }} 
                        />
                      </div>
                      <div className="p-8">
                        <div className="mb-6 flex items-center justify-between">
                          <span className="text-4xl">{item.emoji}</span>
                          <Badge className={cn("rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest", item.severityColor)}>
                            {item.severity}
                          </Badge>
                        </div>
                        <h3 className="mb-2 text-2xl font-black text-title italic">{item.label}</h3>
                        <div className="mb-6 flex items-baseline gap-1.5">
                          <span className="text-4xl font-black text-foreground">{item.score}%</span>
                          <span className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">Intensity</span>
                        </div>
                        <p className="text-sm leading-relaxed text-muted-foreground italic opacity-90">
                          "{item.interpretation}"
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mx-auto mb-20 max-w-3xl">
            <motion.div 
               initial={{ opacity: 0, y: 30 }} 
               animate={{ opacity: 1, y: 0 }} 
               transition={{ delay: 0.4 }}
               className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-card to-secondary/5 border border-secondary/10 shadow-sm p-8 md:p-14"
            >
              <div className="absolute top-0 right-0 p-12 opacity-5">
                <Sparkles className="h-40 w-40 text-secondary" />
              </div>
              
              <div className="relative z-10">
                <div className="mb-8 flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/10 text-secondary shadow-lg shadow-secondary/10">
                    <Sparkles className="h-7 w-7" />
                  </div>
                  <h2 className="text-3xl font-black tracking-tight text-title italic">Blueprint Interpretation</h2>
                </div>
                
                <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed italic text-lg">
                  {interpretation.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-6 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {isPremium && (
                   <div className="mt-12 pt-10 border-t border-secondary/10">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary mb-5">
                        PRO Self-Mastery Insights
                      </h4>
                      <p className="text-md text-muted-foreground mb-8 leading-relaxed italic">
                        Based on your <strong>{topDimension?.label}</strong> profile, we recommend focusing on restoring your internal agency through focused grounding and psychological reframing...
                      </p>
                      <Button variant="link" className="p-0 h-auto text-secondary font-black text-xs uppercase tracking-[0.2em] group">
                         Access Complete Growth Plan <ChevronRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-1.5" />
                      </Button>
                   </div>
                )}
              </div>
            </motion.div>
          </div>

          {recommendedPosts.length > 0 && (
            <div className="mx-auto mb-20 max-w-4xl">
              <div className="mb-10 flex items-center justify-between">
                <h2 className="text-3xl font-black tracking-tight text-title italic">📚 Guided Wisdom</h2>
                <Button variant="link" asChild className="text-secondary font-black uppercase text-[10px] tracking-widest">
                   <Link to="/quizzes">Explore More Journeys</Link>
                </Button>
              </div>
              <div className="grid gap-8 sm:grid-cols-2">
                {recommendedPosts.map((post) =>
                  post ? (
                    <PostCard key={post.slug} title={post.title} excerpt={post.excerpt} category={post.category} readTime={`${post.reading_time}`} slug={post.slug} />
                  ) : null
                )}
              </div>
            </div>
          )}

          {topDimension && !isPremium && (
            <div className="mx-auto mb-20 max-w-2xl overflow-hidden rounded-[2.5rem] bg-secondary p-12 text-center text-white shadow-2xl shadow-secondary/30 relative">
              <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
              <div className="relative z-10">
                <span className="mb-6 inline-block text-5xl">🧪</span>
                <h3 className="mb-4 text-3xl font-black italic">
                  Deepen Your {topDimension.label} Journey
                </h3>
                <p className="mb-10 text-white/90 text-lg leading-relaxed italic">
                  Ready to reclaim your self-mastery? Embark on our advanced analysis for a clinical-level understanding of your unique psychological patterns.
                </p>
                <Button asChild variant="hero" size="lg" className="bg-white text-secondary hover:bg-white/90 px-12 py-8 text-xl rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95 font-black uppercase tracking-widest">
                  <Link to={`/quiz/${topDimension.dimension}`}>
                    Start Deep Journey <ArrowRight className="ml-2 h-6 w-6" />
                  </Link>
                </Button>
              </div>
            </div>
          )}

          {!user && (
            <div className="mx-auto mb-20 max-w-2xl rounded-[2.5rem] border border-secondary/10 bg-card p-12 text-center shadow-lg shadow-primary/5">
              <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-secondary/10 text-secondary">
                <UserPlus className="h-10 w-10" />
              </div>
              <h3 className="mb-3 text-3xl font-black text-title italic">Save Your Discoveries</h3>
              <p className="mb-10 text-muted-foreground leading-relaxed italic text-lg">
                Create a free account to preserve your blueprints, monitor your evolution, and access personalized self-mastery content.
              </p>
              <Button asChild variant="hero" size="lg" className="px-12 py-8 text-xl rounded-full shadow-2xl shadow-primary/20 font-black uppercase tracking-widest">
                <Link to="/login">
                  Begin My Journey <ArrowRight className="ml-2 h-6 w-6" />
                </Link>
              </Button>
            </div>
          )}

          <div className="mx-auto max-w-xl opacity-60">
            <Disclaimer />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ResultPage;
