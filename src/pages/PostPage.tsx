import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TableOfContents from "@/components/TableOfContents";
import ShareButtons from "@/components/ShareButtons";
import QuizCTA from "@/components/QuizCTA";
import QuizInline from "@/components/quiz/QuizInline";
import PremiumAssessmentCTA from "@/components/PremiumAssessmentCTA";
import FaqSection from "@/components/FaqSection";
import AuthorBox from "@/components/AuthorBox";
import Disclaimer from "@/components/Disclaimer";
import PostCard from "@/components/PostCard";
import AdBanner from "@/components/AdBanner";
import SEOHead from "@/components/SEOHead";
import { usePostBySlug, useRelatedPosts } from "@/hooks/usePosts";
import { parseContentSections } from "@/types/database";
import { ChevronRight, Clock, Calendar, ArrowLeft, Lock } from "lucide-react";
import { useI18n } from "@/i18n/I18nContext";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const PostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading } = usePostBySlug(slug);
  const { t, locale, localePath } = useI18n();
  const { user, isPremium } = useAuth();
  const { data: related = [] } = useRelatedPosts(post?.related_post_slugs || []);
  const [showGate, setShowGate] = useState(false);

  useEffect(() => {
    if (isLoading || !post || user || isPremium) return;

    const viewedPosts = JSON.parse(localStorage.getItem("validzen_viewed_posts") || "[]") as string[];
    
    if (!viewedPosts.includes(post.slug)) {
      if (viewedPosts.length >= 5) {
        setShowGate(true);
      } else {
        const newViewed = [...viewedPosts, post.slug];
        localStorage.setItem("validzen_viewed_posts", JSON.stringify(newViewed));
      }
    }
  }, [post, isLoading, user, isPremium]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <div className="container py-8 md:py-12">
            <Skeleton className="mb-4 h-4 w-48" />
            <Skeleton className="mb-6 h-10 w-3/4" />
            <Skeleton className="mb-4 h-4 w-64" />
            <div className="space-y-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <span className="text-5xl">📄</span>
            <h1 className="mt-4 text-2xl font-bold">{t("post.not_found")}</h1>
            <Link to={localePath("/")} className="mt-4 inline-block text-sm text-secondary hover:underline">
              {t("post.back_home")}
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const sections = post?.content ? parseContentSections(post.content) : [];
  const isMarkdown = post?.content ? (/^##\s+/m.test(post.content) && !/<h2[\s>]/i.test(post.content)) : true;
  const url = `https://validzen.app/${locale}/conteudo/${post?.slug}`;
  const author = {
    name: post?.author_name || "ValidZen Team",
    avatar: post?.author_avatar || "",
    bio: post?.author_bio || "",
    credentials: post?.author_credentials || "",
  };

  return (
    <div className="flex min-h-screen flex-col">
      <SEOHead
        title={post.meta_title || post.title}
        description={post.meta_description || post.excerpt}
        canonical={url}
        type="article"
        image={post.featured_image || undefined}
        publishedAt={post.published_at}
        updatedAt={post.updated_at}
        authorName={post.author_name}
        faq={post.faq}
        breadcrumbs={[
          { name: t("nav.home"), url: `https://validzen.app/${locale}` },
          { name: post.category, url: `https://validzen.app/${locale}/categoria/${post.category}` },
          { name: post.title, url },
        ]}
      />
      <Header />
      <main className="flex-1 relative">
        <article className="container py-8 md:py-12">
          <Link to={localePath("/")} className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-secondary transition-colors">
            <ArrowLeft className="h-4 w-4" /> {t("quiz.back")}
          </Link>

          <nav className="mb-6 flex items-center gap-1 text-xs text-muted-foreground" aria-label="Breadcrumb">
            <Link to={localePath("/")} className="hover:text-foreground transition-colors">{t("nav.home")}</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to={localePath(`/categoria/${post.category}`)} className="hover:text-foreground transition-colors">
              {post.category}
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground line-clamp-1">{post.title}</span>
          </nav>

          <header className="mb-8 max-w-3xl">
            <div className="mb-3 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="rounded-md bg-secondary/10 px-2.5 py-0.5 text-xs font-medium text-secondary">
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-2xl font-bold leading-tight md:text-4xl">{post.title}</h1>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span>{t("post.by")} {post.author_name || "ValidZen"}</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {t("post.updated_at")} {post.updated_at ? new Date(post.updated_at).toLocaleDateString(locale === "pt" ? "pt-BR" : "en-US") : ""}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {(post.reading_time || 5)} {t("post.min_read")}
              </span>
              {post.is_premium && (
                <span className="rounded bg-accent/20 px-2 py-0.5 text-xs font-bold text-accent">PRO</span>
              )}
            </div>
            <div className="mt-4">
              <ShareButtons title={post.title} url={url} />
            </div>
          </header>

          <div className="mb-8 max-w-3xl rounded-lg border-l-4 border-secondary bg-muted/50 px-6 py-5">
            <p className="text-sm leading-relaxed text-foreground">{post.excerpt}</p>
          </div>

          <div className="flex gap-10">
            <div className="min-w-0 max-w-3xl flex-1">
              {sections.length > 1 && (
                <div className="mb-8 lg:hidden">
                  <TableOfContents sections={sections} />
                </div>
              )}

              {sections.length > 0 ? (
                sections.map((section, i) => (
                  <div key={section.id}>
                    <section id={section.id} className="mb-8 scroll-mt-24">
                      {section.heading && (
                        <h2 className="mb-4 text-xl font-bold md:text-2xl">{section.heading}</h2>
                      )}
                      {isMarkdown ? (
                        <div className="prose-validzen">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{section.body}</ReactMarkdown>
                        </div>
                      ) : (
                        <div className="prose-validzen" dangerouslySetInnerHTML={{ __html: section.body }} />
                      )}
                    </section>

                    {i === 1 && post.quiz_slug && (
                      <QuizInline
                        quizSlug={post.quiz_slug}
                        title={t("quiz.what_level", { topic: post.category.toLowerCase() })}
                        subtitle={t("quiz.answer_questions", { topic: post.category.toLowerCase() })}
                      />
                    )}
                  </div>
                ))
              ) : (
                isMarkdown ? (
                  <div className="prose-validzen mb-8">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
                  </div>
                ) : (
                  <div className="prose-validzen mb-8" dangerouslySetInnerHTML={{ __html: post.content }} />
                )
              )}

              {post.quiz_slug && (
                <QuizCTA theme={post.category.toLowerCase()} quizSlug={post.quiz_slug} />
              )}

              <PremiumAssessmentCTA postSlug={post.slug} />

              {post.video_url && (
                <section className="my-10">
                  <h2 className="mb-4 text-xl font-bold">{t("post.related_video")}</h2>
                  <div className="aspect-video overflow-hidden rounded-lg border border-border">
                    <iframe
                      src={post.video_url}
                      title={`Video: ${post.title}`}
                      className="h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </section>
              )}

              <FaqSection items={post.faq} />

              <div className="my-8 lg:hidden">
                <AdBanner slot="post-main" format="horizontal" />
              </div>

              {related.length > 0 && (
                <section className="my-10">
                  <h2 className="mb-6 text-xl font-bold">{t("post.related_content")}</h2>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {related.slice(0, 3).map((rp) => (
                      <PostCard
                        key={rp.slug}
                        title={rp.title}
                        excerpt={rp.excerpt}
                        category={rp.category}
                        readTime={`${rp.reading_time} min`}
                        slug={rp.slug}
                      />
                    ))}
                  </div>
                </section>
              )}

              <div className="my-10">
                <AuthorBox {...author} />
              </div>

              <div className="my-10">
                <Disclaimer />
              </div>
            </div>

            <aside className="hidden w-64 shrink-0 lg:block">
              <div className="sticky top-24 space-y-8">
                {sections.length > 1 && <TableOfContents sections={sections} />}
                <AdBanner slot="post-sidebar" format="vertical" className="hidden lg:block" />
              </div>
            </aside>
          </div>
        </article>

        {showGate && (
          <div className="absolute inset-0 z-50 flex items-start justify-center bg-gradient-to-b from-transparent via-background/90 to-background pt-32">
            <div className="sticky top-40 max-w-md w-full bg-card border border-border rounded-2xl p-8 text-center shadow-2xl mx-4">
              <Lock className="mx-auto mb-4 h-10 w-10 text-secondary" />
              <h2 className="text-2xl font-bold mb-3">{t("pro.unlock_title")}</h2>
              <p className="text-muted-foreground mb-6 text-sm">
                {t("pro.unlock_desc_full")}
              </p>
              <div className="flex flex-col gap-3">
                <Button asChild size="lg" variant="hero">
                  <Link to={localePath("/login")}>{t("result.create_account")}</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default PostPage;
