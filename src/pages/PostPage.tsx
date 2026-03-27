import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TableOfContents from "@/components/TableOfContents";
import ShareButtons from "@/components/ShareButtons";
import QuizCTA from "@/components/QuizCTA";
import QuizInline from "@/components/quiz/QuizInline";
import FaqSection from "@/components/FaqSection";
import AuthorBox from "@/components/AuthorBox";
import Disclaimer from "@/components/Disclaimer";
import PostCard from "@/components/PostCard";
import AdBanner from "@/components/AdBanner";
import { getPostBySlug, getRelatedPosts } from "@/data/posts";
import { ChevronRight, Clock, Calendar } from "lucide-react";
import { useI18n } from "@/i18n/I18nContext";

const PostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : undefined;
  const { t, locale, localePath } = useI18n();

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

  const related = getRelatedPosts(post.relatedPosts);
  const url = `https://validzen.app/${locale}/conteudo/${post.slug}`;

  // Track which section index we're at for ad insertion
  let sectionIndex = 0;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <article className="container py-8 md:py-12">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-1 text-xs text-muted-foreground" aria-label="Breadcrumb">
            <Link to={localePath("/")} className="hover:text-foreground transition-colors">{t("nav.home")}</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to={localePath(`/categoria/${post.categorySlug}`)} className="hover:text-foreground transition-colors">
              {post.category}
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground line-clamp-1">{post.title}</span>
          </nav>

          {/* Header */}
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
              <span>{t("post.by")} {post.author.name}</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {t("post.updated_at")} {new Date(post.updatedAt).toLocaleDateString(locale === "pt" ? "pt-BR" : "en-US")}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {post.readingTime} {t("post.min_read")}
              </span>
              {post.isPremium && (
                <span className="rounded bg-accent/20 px-2 py-0.5 text-xs font-bold text-accent">PRO</span>
              )}
            </div>
            <div className="mt-4">
              <ShareButtons title={post.title} url={url} />
            </div>
          </header>

          {/* Featured snippet */}
          <div className="mb-8 max-w-3xl rounded-lg border-l-4 border-secondary bg-muted/50 px-6 py-5">
            <p className="text-sm leading-relaxed text-foreground">{post.excerpt}</p>
          </div>

          {/* Layout */}
          <div className="flex gap-10">
            <div className="min-w-0 max-w-3xl flex-1">
              <div className="mb-8 lg:hidden">
                <TableOfContents sections={post.sections} />
              </div>

              {post.sections.map((section) => {
                sectionIndex++;
                const showAdAfter = sectionIndex === 2 || sectionIndex === 4;
                return (
                  <div key={section.id}>
                    <section id={section.id} className="mb-8 scroll-mt-24">
                      <h2 className="mb-4 text-xl font-bold md:text-2xl">{section.heading}</h2>
                      <div className="prose-validzen" dangerouslySetInnerHTML={{ __html: section.body }} />
                    </section>

                    {section.quizAfter && post.quizSlug && (
                      <QuizInline
                        quizSlug={post.quizSlug}
                        title={t("quiz.what_level", { topic: post.category.toLowerCase() })}
                        subtitle={t("quiz.answer_questions", { topic: post.category.toLowerCase() })}
                      />
                    )}

                    {/* Removed: in-article ads */}
                  </div>
                );
              })}

              {post.quizSlug && (
                <QuizCTA theme={post.category.toLowerCase()} quizSlug={post.quizSlug} />
              )}

              {post.videoUrl && (
                <section className="my-10">
                  <h2 className="mb-4 text-xl font-bold">{t("post.related_video")}</h2>
                  <div className="aspect-video overflow-hidden rounded-lg border border-border">
                    <iframe
                      src={post.videoUrl}
                      title={`Video: ${post.title}`}
                      className="h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </section>
              )}

              <FaqSection items={post.faq} />

              {/* Single ad per page — sidebar on desktop, here on mobile */}
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
                        readTime={`${rp.readingTime} min`}
                        slug={rp.slug}
                      />
                    ))}
                  </div>
                </section>
              )}

              <div className="my-10">
                <AuthorBox {...post.author} />
              </div>

              <div className="my-10">
                <Disclaimer />
              </div>
            </div>

            <aside className="hidden w-64 shrink-0 lg:block">
              <div className="sticky top-24 space-y-8">
                <TableOfContents sections={post.sections} />
                <AdBanner slot="post-sidebar" format="vertical" />
              </div>
            </aside>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default PostPage;
