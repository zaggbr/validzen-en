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
import { Lock, ArrowRight, Crown, Calendar, TrendingUp } from "lucide-react";
import { getResultsFromLocalStorage } from "@/lib/quizScoring";
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

const DashboardPage = () => {
  const results = getResultsFromLocalStorage();
  const latestResult = results.length > 0 ? results[results.length - 1] : null;

  // No results
  if (!latestResult) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 flex-col items-center justify-center py-20 text-center">
          <span className="mb-4 text-5xl">🧭</span>
          <h1 className="mb-2 text-2xl font-bold text-title">
            Seu Mapa Emocional
          </h1>
          <p className="mb-6 text-sm text-muted-foreground">
            Faça o quiz para criar seu primeiro mapa.
          </p>
          <Button asChild variant="hero" size="lg">
            <Link to="/quiz/geral">
              Começar o Quiz <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const top = getTopDimensions(latestResult.scores);
  const interpretation = generateInterpretation(top);
  const recommendedSlugs = getRecommendedPostSlugs(latestResult.scores);
  const recommendedPosts = recommendedSlugs
    .map((s) => posts.find((p) => p.slug === s))
    .filter(Boolean);

  const radarData = Object.entries(latestResult.scores).map(([dim, score]) => ({
    dimension: DIMENSION_LABELS[dim as Dimension] ?? dim,
    score,
    fullMark: 100,
  }));

  // Mock evolution data for PRO section
  const mockEvolution = [
    { date: "Jan", ansiedade: 72, burnout: 65, depressao: 45 },
    { date: "Fev", ansiedade: 68, burnout: 60, depressao: 50 },
    { date: "Mar", ansiedade: 60, burnout: 55, depressao: 42 },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container py-10 md:py-16">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <h1 className="mb-1 text-3xl font-bold text-title md:text-4xl">
              🧭 Meu Mapa Emocional
            </h1>
            <p className="text-sm text-muted-foreground">
              Seu panorama de autoconhecimento
            </p>
          </motion.div>

          {/* ─── FREE SECTION ─── */}

          {/* Latest Radar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-10"
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Último resultado</CardTitle>
                <p className="text-xs text-muted-foreground">
                  {new Date(latestResult.completedAt).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={360}>
                  <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis
                      dataKey="dimension"
                      tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                    />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 9 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "0.5rem",
                        fontSize: "0.8rem",
                      }}
                      formatter={(v: number) => [`${v}%`, "Score"]}
                    />
                    <Radar
                      dataKey="score"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.2}
                      strokeWidth={2}
                      dot={{ r: 3, fill: "hsl(var(--secondary))", stroke: "hsl(var(--secondary))" }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Top 3 */}
          <div className="mb-10">
            <h2 className="mb-4 text-xl font-bold text-title">
              Top 3 dimensões
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {top.map((item, i) => (
                <motion.div
                  key={item.dimension}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.08 }}
                >
                  <Card className="h-full">
                    <CardContent className="flex flex-col items-center p-5 text-center">
                      <span className="mb-1 text-2xl">{item.emoji}</span>
                      <h3 className="text-sm font-bold text-title">{item.label}</h3>
                      <span className="mb-1 text-xl font-bold">{item.score}%</span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${item.severityColor}`}
                      >
                        {item.severity}
                      </span>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Interpretation */}
          <div className="mb-10 rounded-lg border-l-4 border-secondary bg-muted/40 px-6 py-5">
            <p className="text-sm leading-relaxed text-muted-foreground">
              {interpretation}
            </p>
          </div>

          {/* History (simple) */}
          <div className="mb-10">
            <h2 className="mb-4 text-xl font-bold text-title">
              <Calendar className="mr-2 inline h-5 w-5" />
              Histórico
            </h2>
            <Card>
              <CardContent className="p-4">
                {results.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nenhum quiz feito ainda.</p>
                ) : (
                  <ul className="divide-y divide-border">
                    {results.map((r) => (
                      <li key={r.id} className="flex items-center justify-between py-3">
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            Quiz{" "}
                            {r.quizId === "generic" ? "Genérico" : r.quizId}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(r.completedAt).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                        <Button asChild variant="ghost" size="sm">
                          <Link to={`/resultado/${r.id}`}>Ver →</Link>
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recommended Content */}
          {recommendedPosts.length > 0 && (
            <div className="mb-12">
              <h2 className="mb-4 text-xl font-bold text-title">
                📚 Conteúdo recomendado
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {recommendedPosts.map((post) =>
                  post ? (
                    <PostCard
                      key={post.slug}
                      title={post.title}
                      excerpt={post.excerpt}
                      category={post.category}
                      readTime={`${post.readingTime} min`}
                      slug={post.slug}
                    />
                  ) : null
                )}
              </div>
            </div>
          )}

          {/* ─── PRO SECTION (blurred) ─── */}
          <div className="relative mb-12">
            {/* Blur overlay */}
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-xl bg-background/70 backdrop-blur-md">
              <Crown className="mb-3 h-10 w-10 text-secondary" />
              <h3 className="mb-1 text-lg font-bold text-title">
                Desbloqueie o Dashboard Completo
              </h3>
              <p className="mb-4 max-w-sm text-center text-sm text-muted-foreground">
                Evolução ao longo do tempo, deep-dive por dimensão, exportar PDF para seu terapeuta e plano de 30 dias.
              </p>
              <Button variant="hero" size="lg" asChild>
                <Link to="/pro">
                  <Lock className="mr-1.5 h-4 w-4" />
                  Desbloquear com PRO — R$14,90/mês
                </Link>
              </Button>
            </div>

            {/* Content behind blur */}
            <div className="pointer-events-none select-none space-y-8 rounded-xl border border-border p-6">
              {/* Evolution chart */}
              <div>
                <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-title">
                  <TrendingUp className="h-5 w-5" />
                  Evolução ao longo do tempo
                </h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockEvolution}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="ansiedade"
                        name="Ansiedade"
                        stroke="hsl(var(--destructive))"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="burnout"
                        name="Burnout"
                        stroke="hsl(var(--secondary))"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="depressao"
                        name="Depressão"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Deep dive placeholders */}
              <div>
                <h2 className="mb-4 text-lg font-bold text-title">
                  🔬 Deep-dive por dimensão
                </h2>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {Object.entries(DIMENSION_LABELS)
                    .slice(0, 6)
                    .map(([dim, label]) => (
                      <Card key={dim}>
                        <CardContent className="p-4">
                          <span className="text-lg">
                            {DIMENSION_EMOJIS[dim as Dimension]}
                          </span>
                          <h4 className="text-sm font-bold text-title">
                            {label}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            Score atual, histórico, conteúdos lidos
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>

              {/* Export & Plan */}
              <div className="flex flex-col gap-4 sm:flex-row">
                <Card className="flex-1">
                  <CardContent className="p-5 text-center">
                    <span className="text-3xl">📄</span>
                    <h4 className="mt-2 text-sm font-bold text-title">
                      Exportar PDF
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Relatório para levar ao terapeuta
                    </p>
                  </CardContent>
                </Card>
                <Card className="flex-1">
                  <CardContent className="p-5 text-center">
                    <span className="text-3xl">📅</span>
                    <h4 className="mt-2 text-sm font-bold text-title">
                      Plano de 30 dias
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Roteiro personalizado de autoconhecimento
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
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
