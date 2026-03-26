import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Disclaimer from "@/components/Disclaimer";
import PostCard from "@/components/PostCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Share2, ArrowRight, UserPlus } from "lucide-react";
import { getResultById } from "@/lib/quizScoring";
import {
  DIMENSION_LABELS,
  DIMENSION_EMOJIS,
  Dimension,
} from "@/data/quizTypes";
import {
  getTopDimensions,
  generateInterpretation,
  getRecommendedPostSlugs,
} from "@/lib/quizInsights";
import { posts } from "@/data/posts";
import { useI18n } from "@/i18n/I18nContext";

const ResultPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const result = id ? getResultById(id) : undefined;
  const { t, locale, localePath } = useI18n();

  if (!result) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 flex-col items-center justify-center py-20 text-center">
          <span className="mb-4 text-5xl">🔍</span>
          <h1 className="mb-2 text-2xl font-bold text-title">{t("result.not_found")}</h1>
          <p className="mb-6 text-sm text-muted-foreground">{t("result.not_found_desc")}</p>
          <Button asChild variant="hero" size="lg">
            <Link to={localePath("/quiz/geral")}>{t("result.take_quiz")}</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const top = getTopDimensions(result.scores);
  const interpretation = generateInterpretation(top);
  const recommendedSlugs = getRecommendedPostSlugs(result.scores);
  const recommendedPosts = recommendedSlugs
    .map((s) => posts.find((p) => p.slug === s))
    .filter(Boolean);
  const topDimension = top[0];

  const radarData = Object.entries(result.scores).map(([dim, score]) => ({
    dimension: DIMENSION_LABELS[dim as Dimension] ?? dim,
    score,
    fullMark: 100,
  }));

  const completedDate = new Date(result.completedAt).toLocaleDateString(
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
      <Header />
      <main className="flex-1">
        <div className="container py-10 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 text-center"
          >
            <span className="mb-3 inline-block text-5xl">🗺️</span>
            <h1 className="mb-2 text-3xl font-bold text-title md:text-4xl">{t("result.title")}</h1>
            <p className="mb-4 text-sm text-muted-foreground">
              {t("result.completed_at")} {completedDate}
            </p>
            <Button variant="outline" size="sm" onClick={handleShare} className="gap-1.5">
              <Share2 className="h-4 w-4" /> {t("result.share")}
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="mx-auto mb-12 max-w-2xl"
          >
            <Card>
              <CardContent className="p-4 md:p-8">
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "0.5rem",
                        fontSize: "0.875rem",
                      }}
                      formatter={(value: number) => [`${value}%`, "Score"]}
                    />
                    <Radar
                      name="Score"
                      dataKey="score"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.2}
                      strokeWidth={2}
                      dot={{ r: 4, fill: "hsl(var(--secondary))", stroke: "hsl(var(--secondary))" }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          <div className="mx-auto mb-12 max-w-3xl">
            <h2 className="mb-5 text-center text-xl font-bold text-title">{t("result.top_dimensions")}</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {top.map((item, i) => (
                <motion.div key={item.dimension} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }}>
                  <Card className="h-full">
                    <CardContent className="flex flex-col items-center p-5 text-center">
                      <span className="mb-2 text-3xl">{item.emoji}</span>
                      <h3 className="mb-1 text-sm font-bold text-title">{item.label}</h3>
                      <span className="mb-2 text-2xl font-bold text-foreground">{item.score}%</span>
                      <span className={`mb-3 rounded-full px-3 py-0.5 text-xs font-semibold capitalize ${item.severityColor}`}>
                        {item.severity}
                      </span>
                      <p className="text-xs text-muted-foreground">{item.insight.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mx-auto mb-12 max-w-2xl rounded-lg border-l-4 border-secondary bg-muted/40 px-6 py-5">
            <h2 className="mb-2 text-sm font-bold text-title">📝 {t("result.interpretation")}</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">{interpretation}</p>
          </motion.div>

          {recommendedPosts.length > 0 && (
            <div className="mx-auto mb-12 max-w-3xl">
              <h2 className="mb-5 text-xl font-bold text-title">📚 {t("result.recommended")}</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {recommendedPosts.map((post) =>
                  post ? (
                    <PostCard key={post.slug} title={post.title} excerpt={post.excerpt} category={post.category} readTime={`${post.readingTime} min`} slug={post.slug} />
                  ) : null
                )}
              </div>
            </div>
          )}

          {topDimension && (
            <div className="mx-auto mb-12 max-w-xl rounded-lg border border-primary/10 bg-primary/5 p-6 text-center">
              <span className="mb-2 inline-block text-3xl">🧪</span>
              <h3 className="mb-1 text-base font-bold text-title">
                {t("result.deep_dive_title", { dimension: topDimension.label })}
              </h3>
              <p className="mb-4 text-sm text-muted-foreground">{t("result.deep_dive_desc")}</p>
              <Button asChild variant="secondary" size="lg">
                <Link to={localePath(`/quiz/${topDimension.dimension}`)}>
                  {t("result.deep_dive_cta", { dimension: topDimension.label })} <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}

          <div className="mx-auto mb-12 max-w-xl rounded-lg border border-border bg-card p-6 text-center">
            <UserPlus className="mx-auto mb-3 h-8 w-8 text-primary" />
            <h3 className="mb-1 text-base font-bold text-title">{t("result.save_cta_title")}</h3>
            <p className="mb-4 text-sm text-muted-foreground">{t("result.save_cta_desc")}</p>
            <Button asChild variant="hero" size="lg">
              <Link to={localePath("/login")}>
                {t("result.create_account")} <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="mx-auto max-w-xl">
            <Disclaimer />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ResultPage;
