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
import { useI18n } from "@/i18n/I18nContext";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const ResultPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: result, isLoading: loadingResult } = useResultById(id);
  const { t, locale, localePath } = useI18n();
  const { data: allPosts = [] } = usePosts(locale);
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
              <Skeleton className="mx-auto h-4 w-48" />
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
          <h1 className="mb-2 text-2xl font-bold text-title">{t("result.not_found")}</h1>
          <p className="mb-6 text-sm text-muted-foreground">{t("result.not_found_desc")}</p>
          <Button asChild variant="hero" size="lg">
            <Link to={localePath("/quizzes")}>{t("result.take_quiz")}</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const top = getTopDimensions(result.scores, dimensions, locale);
  const interpretation = generateInterpretation(top, locale);

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

  const completedDate = new Date(result.completed_at).toLocaleDateString(
    locale === "pt" ? "pt-BR" : "en-US",
    { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }
  );

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: t("result.share_title"), url });
    } else {
      await navigator.clipboard.writeText(url);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <SEOHead title={t("result.title") + " — ValidZen"} description="" noindex />
      <Header />
      <main className="flex-1">
        <div className="container py-10 md:py-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center">
            <Link to={localePath("/")} className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-secondary transition-colors">
              <ArrowLeft className="h-4 w-4" /> {t("quiz.back")}
            </Link>
            <br />
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-4xl shadow-sm">
              🧭
            </div>
            <h1 className="mb-2 text-3xl font-black tracking-tight text-title md:text-5xl">{t("result.title")}</h1>
            <p className="mb-6 text-sm font-medium text-muted-foreground uppercase tracking-widest">
              {t("result.completed_at")} {completedDate}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button variant="outline" size="sm" onClick={handleShare} className="gap-1.5 rounded-full px-5">
                <Share2 className="h-4 w-4" /> {t("result.share")}
              </Button>
              {/* Instagram share */}
              <a
                href={`https://www.instagram.com/`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-pink-500 hover:text-pink-500"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                Instagram
              </a>
              {/* Facebook share */}
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-blue-600 hover:text-blue-600"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                Facebook
              </a>
              {isPremium && (
                <Button variant="outline" size="sm" disabled className="gap-1.5 rounded-full px-5 border-secondary/30 text-secondary/60 bg-secondary/5 cursor-not-allowed">
                   <ClipboardCheck className="h-4 w-4" /> {locale === "pt" ? "Relatório (Em breve)" : "Report (Coming soon)"}
                </Button>
              )}
            </div>
          </motion.div>

          {/* New Card-based Result Visualization */}
          <div className="mx-auto mb-20 max-w-4xl">
            <div className="grid gap-6 md:grid-cols-2">
              {top.slice(0, 4).map((item, i) => (
                <motion.div 
                  key={item.dimension} 
                  initial={{ opacity: 0, scale: 0.95 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className={cn(
                    "h-full overflow-hidden border-border/50 transition-all hover:shadow-xl",
                    i === 0 && "ring-2 ring-primary/20 shadow-lg"
                  )}>
                    <CardContent className="p-0">
                      <div className="h-1.5 bg-muted/30">
                        <div 
                          className="h-full bg-secondary transition-all duration-1000" 
                          style={{ width: `${item.score}%` }} 
                        />
                      </div>
                      <div className="p-8">
                        <div className="mb-4 flex items-center justify-between">
                          <span className="text-4xl">{item.emoji}</span>
                          <Badge className={cn("rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest", item.severityColor)}>
                            {item.severity}
                          </Badge>
                        </div>
                        <h3 className="mb-2 text-xl font-bold text-title">{item.label}</h3>
                        <div className="mb-6 flex items-baseline gap-1">
                          <span className="text-4xl font-black text-foreground">{item.score}%</span>
                          <span className="text-xs text-muted-foreground font-bold uppercase tracking-tighter">Intensidade</span>
                        </div>
                        <p className="text-sm leading-relaxed text-muted-foreground italic">
                          "{item.interpretation}"
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mx-auto mb-16 max-w-3xl">
            <AdBanner slot="result-after-cards" format="rectangle" className="mx-auto" />
          </div>

          <div className="mx-auto mb-20 max-w-3xl">
            <motion.div 
               initial={{ opacity: 0, y: 30 }} 
               animate={{ opacity: 1, y: 0 }} 
               transition={{ delay: 0.4 }}
               className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-card to-muted/30 border border-border shadow-sm p-8 md:p-12"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Sparkles className="h-32 w-32" />
              </div>
              
              <div className="relative z-10">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl font-black tracking-tight text-title">{t("result.interpretation")}</h2>
                </div>
                
                <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed">
                  {interpretation.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {isPremium && (
                   <div className="mt-10 pt-8 border-t border-border/50">
                      <h4 className="text-xs font-black uppercase tracking-[0.2em] text-secondary mb-4">
                        {locale === "pt" ? "Recomendações Clínicas PRO" : "PRO Clinical Recommendations"}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-6">
                        Com base no seu perfil de <strong>{topDimension?.label}</strong>, nosso sistema sugere foco imediato em regulação emocional e higiene do sono...
                      </p>
                      <Button variant="link" className="p-0 h-auto text-secondary font-bold text-xs uppercase tracking-wider group">
                         {locale === "pt" ? "Acessar Guia de Ação Completo" : "Access Full Action Guide"} <ChevronRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
                      </Button>
                   </div>
                )}
              </div>
            </motion.div>
          </div>

          {recommendedPosts.length > 0 && (
            <div className="mx-auto mb-20 max-w-4xl">
              <div className="mb-8 flex items-center justify-between">
                <h2 className="text-2xl font-black tracking-tight text-title italic">📚 {t("result.recommended")}</h2>
                <Button variant="link" asChild className="text-secondary font-bold">
                   <Link to={localePath("/")}>{locale === "pt" ? "Ver todos" : "View all"}</Link>
                </Button>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                {recommendedPosts.map((post) =>
                  post ? (
                    <PostCard key={post.slug} title={post.title} excerpt={post.excerpt} category={post.category} readTime={`${post.reading_time} min`} slug={post.slug} />
                  ) : null
                )}
              </div>
            </div>
          )}

          {topDimension && !isPremium && (
            <div className="mx-auto mb-20 max-w-2xl overflow-hidden rounded-3xl bg-secondary p-10 text-center text-white shadow-2xl relative">
              <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
              <div className="relative z-10">
                <span className="mb-4 inline-block text-4xl">🧪</span>
                <h3 className="mb-3 text-2xl font-black">
                  {t("result.deep_dive_title", { dimension: topDimension.label })}
                </h3>
                <p className="mb-8 text-white/80 text-md leading-relaxed">
                  {t("result.deep_dive_desc")}
                </p>
                <Button asChild variant="hero" size="lg" className="bg-white text-secondary hover:bg-white/90 px-10 py-7 text-lg rounded-full shadow-xl">
                  <Link to={localePath(`/quiz/${topDimension.dimension}`)}>
                    {t("result.deep_dive_cta", { dimension: topDimension.label })} <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          )}

          {!user && (
            <div className="mx-auto mb-20 max-w-2xl rounded-3xl border border-border bg-card p-10 text-center shadow-sm">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 text-primary">
                <UserPlus className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-2xl font-black text-title">{t("result.save_cta_title")}</h3>
              <p className="mb-8 text-muted-foreground leading-relaxed">
                {t("result.save_cta_desc")}
              </p>
              <Button asChild variant="hero" size="lg" className="px-10 py-7 text-lg rounded-full shadow-lg shadow-primary/20">
                <Link to={localePath("/login")}>
                  {t("result.create_account")} <ArrowRight className="ml-2 h-5 w-5" />
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
