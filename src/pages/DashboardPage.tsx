import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Disclaimer from "@/components/Disclaimer";
import PostCard from "@/components/PostCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Calendar, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import PremiumGate from "@/components/PremiumGate";
import { useLatestResult, useProgressOverTime } from "@/hooks/useDashboard";
import { usePosts } from "@/hooks/usePosts";
import { useDimensions } from "@/hooks/useDimensions";
import { getTopDimensions, generateInterpretation } from "@/lib/quizInsights";
import { useI18n } from "@/i18n/I18nContext";

const DashboardPage = () => {
  const { data: latestResult, results, isLoading } = useLatestResult();
  const evolutionData = useProgressOverTime();
  const { t, locale, localePath } = useI18n();
  const { data: allPosts = [] } = usePosts(locale);
  const { data: dimensions = [] } = useDimensions();

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

  if (!latestResult) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 flex-col items-center justify-center py-20 text-center">
          <span className="mb-4 text-5xl">🧭</span>
          <h1 className="mb-2 text-2xl font-bold text-title">{t("dashboard.title")}</h1>
          <p className="mb-6 text-sm text-muted-foreground">{t("dashboard.no_results")}</p>
          <Button asChild variant="hero" size="lg">
            <Link to={localePath("/quiz/geral")}>
              {t("dashboard.cta_quiz")} <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const top = getTopDimensions(latestResult.scores, dimensions, locale);
  const interpretation = generateInterpretation(top, locale);

  const recommendedSlugs = latestResult.recommended_post_slugs.length > 0
    ? latestResult.recommended_post_slugs
    : dimensions
        .filter((d) => top.some((t) => t.dimension === d.slug))
        .flatMap((d) => d.recommended_post_slugs)
        .slice(0, 4);

  const recommendedPosts = recommendedSlugs
    .map((s) => allPosts.find((p) => p.slug === s))
    .filter(Boolean);

  const dimMap = new Map(dimensions.map((d) => [d.slug, d]));
  const radarData = Object.entries(latestResult.scores).map(([dim, score]) => {
    const d = dimMap.get(dim);
    return {
      dimension: d ? (locale === "en" ? d.name_en : d.name_pt) : dim,
      score,
      fullMark: 100,
    };
  });

  const dimensionKeys = evolutionData.length > 0
    ? Object.keys(evolutionData[0]).filter((k) => k !== "date")
    : [];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container py-10 md:py-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
            <h1 className="mb-1 text-3xl font-bold text-title md:text-4xl">🧭 {t("dashboard.title")}</h1>
            <p className="text-sm text-muted-foreground">{t("dashboard.subtitle")}</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="mb-10">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t("dashboard.latest_result")}</CardTitle>
                <p className="text-xs text-muted-foreground">
                  {new Date(latestResult.completed_at).toLocaleDateString(locale === "pt" ? "pt-BR" : "en-US", { day: "2-digit", month: "long", year: "numeric" })}
                </p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={360}>
                  <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 9 }} />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "0.5rem", fontSize: "0.8rem" }} formatter={(v: number) => [`${v}%`, "Score"]} />
                    <Radar dataKey="score" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} strokeWidth={2} dot={{ r: 3, fill: "hsl(var(--secondary))", stroke: "hsl(var(--secondary))" }} />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          <div className="mb-10">
            <h2 className="mb-4 text-xl font-bold text-title">{t("dashboard.top_3")}</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {top.map((item, i) => (
                <motion.div key={item.dimension} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.08 }}>
                  <Card className="h-full">
                    <CardContent className="flex flex-col items-center p-5 text-center">
                      <span className="mb-1 text-2xl">{item.emoji}</span>
                      <h3 className="text-sm font-bold text-title">{item.label}</h3>
                      <span className="mb-1 text-xl font-bold">{item.score}%</span>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${item.severityColor}`}>{item.severity}</span>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mb-10 rounded-lg border-l-4 border-secondary bg-muted/40 px-6 py-5">
            <p className="text-sm leading-relaxed text-muted-foreground">{interpretation}</p>
          </div>

          <div className="mb-10">
            <h2 className="mb-4 text-xl font-bold text-title">
              <Calendar className="mr-2 inline h-5 w-5" />{t("dashboard.history")}
            </h2>
            <Card>
              <CardContent className="p-4">
                {!results || results.length === 0 ? (
                  <p className="text-sm text-muted-foreground">{t("dashboard.no_history")}</p>
                ) : (
                  <ul className="divide-y divide-border">
                    {results.map((r) => (
                      <li key={r.id} className="flex items-center justify-between py-3">
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            Quiz {r.quiz_slug === "geral" ? (locale === "pt" ? "Genérico" : "General") : r.quiz_slug}
                          </p>
                          <p className="text-xs text-muted-foreground">{new Date(r.completed_at).toLocaleDateString(locale === "pt" ? "pt-BR" : "en-US")}</p>
                        </div>
                        <Button asChild variant="ghost" size="sm">
                          <Link to={localePath(`/resultado/${r.id}`)}>{t("dashboard.view")}</Link>
                        </Button>
                      </li>
                    ))}
                  </ul>
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
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
                <Card className="flex-1">
                  <CardContent className="p-5 text-center">
                    <span className="text-3xl">📄</span>
                    <h4 className="mt-2 text-sm font-bold text-title">{t("dashboard.export_pdf")}</h4>
                    <p className="text-xs text-muted-foreground">{t("dashboard.export_pdf_desc")}</p>
                  </CardContent>
                </Card>
                <Card className="flex-1">
                  <CardContent className="p-5 text-center">
                    <span className="text-3xl">📅</span>
                    <h4 className="mt-2 text-sm font-bold text-title">{t("dashboard.plan_30days")}</h4>
                    <p className="text-xs text-muted-foreground">{t("dashboard.plan_30days_desc")}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </PremiumGate>

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
