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
import { ChevronRight, Clock, Calendar, ArrowLeft, Lock, Crown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const PostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading } = usePostBySlug(slug);
  const { user, isPremium, incrementPostView } = useAuth();
  const { data: related = [] } = useRelatedPosts(post?.related_post_slugs || []);
  const [showGate, setShowGate] = useState(false);

  useEffect(() => {
    setShowGate(false); 
    const handleViewCounter = async () => {
      if (isLoading || !post || isPremium) return;

      if (post.is_premium) {
        setShowGate(true);
        return;
      }

      const canView = await incrementPostView(post.slug);
      if (!canView) {
        setShowGate(true);
      }
    };

    handleViewCounter();
  }, [slug, post, isLoading, isPremium, incrementPostView]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <div className="container py-8 md:py-12 space-y-6">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-4 w-64" />
            <div className="space-y-6">
              <Skeleton className="h-40 w-full rounded-2xl" />
              <Skeleton className="h-40 w-full rounded-2xl" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <span className="text-6xl">📄</span>
            <h1 className="mt-6 text-3xl font-bold">Insight Territory Not Found</h1>
            <Link to="/dashboard" className="mt-4 inline-block text-xs font-bold uppercase tracking-widest text-secondary hover:underline">
              Return to Blueprint
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const sections = post?.content ? parseContentSections(post.content) : [];
  const isMarkdown = post?.content ? (/^##\s+/m.test(post.content) && !/<h2[\s>]/i.test(post.content)) : true;
  const url = `${window.location.origin}/content/${post?.slug}`;
  const author = {
    name: post?.author_name || "ValidZen Team",
    avatar: post?.author_avatar || "",
    bio: post?.author_bio || "",
    credentials: post?.author_credentials || "",
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
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
          { name: "Home", url: window.location.origin },
          { name: post.category, url: `${window.location.origin}/category/${post.category}` },
          { name: post.title, url },
        ]}
      />
      <Header />
      <main className="flex-1 relative">
        <article className="container py-12 md:py-20">
          <Link to="/dashboard" className="mb-10 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-secondary transition-colors">
            <ArrowLeft className="h-4 w-4" /> Return to Blueprint
          </Link>

          <nav className="mb-8 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-secondary transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3 opacity-30" />
            <Link to={`/category/${post.category}`} className="hover:text-secondary transition-colors text-secondary">
              {post.category}
            </Link>
            <ChevronRight className="h-3 w-3 opacity-30" />
            <span className="text-foreground/60 line-clamp-1">{post.title}</span>
          </nav>

          <header className="mb-12 max-w-4xl">
            <div className="mb-6 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-secondary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-secondary">
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-3xl font-bold leading-tight md:text-5xl tracking-tight text-title">{post.title}</h1>
            <div className="mt-6 flex flex-wrap items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-70">
              <span className="italic">By {post.author_name || "ValidZen Intelligence"}</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                Updated {post.updated_at ? new Date(post.updated_at).toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' }) : ""}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {(post.reading_time || 5)} Min Journey
              </span>
              {post.is_premium && (
                <span className="flex items-center gap-1 text-secondary">
                  <Crown className="h-3.5 w-3.5" /> PRO BLUEPRINT
                </span>
              )}
            </div>
            <div className="mt-8">
              <ShareButtons title={post.title} url={url} />
            </div>
          </header>

          <div className="mb-12 max-w-4xl rounded-[2rem] border border-secondary/20 bg-secondary/5 p-8 md:p-10 shadow-sm">
            <p className="text-lg leading-relaxed text-title font-medium">{post.excerpt}</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-16">
            <div className="min-w-0 max-w-3xl flex-1">
              {sections.length > 1 && !showGate && (
                <div className="mb-10 lg:hidden">
                  <TableOfContents sections={sections} />
                </div>
              )}

              {showGate ? (
                <div className="relative">
                  <div className="prose prose-sm md:prose-base max-w-none prose-headings:text-title prose-headings:font-bold prose-headings:not-italic prose-p:text-muted-foreground prose-p:not-italic prose-table:w-full prose-th:bg-muted prose-th:font-semibold prose-td:border-t prose-td:border-border blur-sm select-none pointer-events-none opacity-40">
                    {sections.length > 0 ? (
                       <section className="mb-8">{sections[0].body.substring(0, 400)}...</section>
                    ) : (
                       <div className="mb-8">{post.content.substring(0, 400)}...</div>
                    )}
                  </div>
                </div>
              ) : sections.length > 0 ? (
                sections.map((section, i) => (
                  <div key={section.id}>
                    <section id={section.id} className="mb-12 scroll-mt-24">
                      {section.heading && (
                        <h2 className="mb-6 text-2xl font-bold text-title md:text-3xl tracking-tight">{section.heading}</h2>
                      )}
                      {isMarkdown ? (
                        <div className="prose prose-sm md:prose-base max-w-none prose-headings:text-title prose-headings:font-bold prose-headings:not-italic prose-p:text-muted-foreground prose-p:not-italic prose-strong:text-foreground prose-table:w-full prose-th:bg-muted prose-th:font-semibold prose-td:border-t prose-td:border-border">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{section.body}</ReactMarkdown>
                        </div>
                      ) : (
                        <div className="prose prose-sm md:prose-base max-w-none prose-headings:text-title prose-headings:font-bold prose-headings:not-italic prose-p:text-muted-foreground prose-p:not-italic prose-strong:text-foreground prose-table:w-full prose-th:bg-muted prose-th:font-semibold prose-td:border-t prose-td:border-border" dangerouslySetInnerHTML={{ __html: section.body }} />
                      )}
                    </section>

                    {i === 1 && post.quiz_slug && (
                      <QuizInline
                        quizSlug={post.quiz_slug}
                        title={`What is your ${post.category.toLowerCase()} agency level?`}
                        subtitle="Embark on a 10-step discovery path to map your current internal state."
                      />
                    )}
                  </div>
                ))
              ) : (
                isMarkdown ? (
                  <div className="prose prose-sm md:prose-base max-w-none prose-headings:text-title prose-headings:font-bold prose-headings:not-italic prose-p:text-muted-foreground prose-p:not-italic prose-strong:text-foreground prose-table:w-full prose-th:bg-muted prose-th:font-semibold prose-td:border-t prose-td:border-border mb-12">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
                  </div>
                ) : (
                  <div className="prose prose-sm md:prose-base max-w-none prose-headings:text-title prose-headings:font-bold prose-headings:not-italic prose-p:text-muted-foreground prose-p:not-italic prose-strong:text-foreground prose-table:w-full prose-th:bg-muted prose-th:font-semibold prose-td:border-t prose-td:border-border mb-12" dangerouslySetInnerHTML={{ __html: post.content }} />
                )
              )}

              {!showGate && post.quiz_slug && (
                <QuizCTA theme={post.category.toLowerCase()} quizSlug={post.quiz_slug} />
              )}

              {!showGate && <PremiumAssessmentCTA postSlug={post.slug} />}

              {post.video_url && (
                <section className="my-16 border-t border-border pt-12">
                  <h2 className="mb-6 text-2xl font-bold text-title">Guided Self-Mastery Video</h2>
                  <div className="aspect-video overflow-hidden rounded-[2rem] border border-border shadow-2xl">
                    <iframe
                      src={post.video_url}
                      title={`Guided Insight: ${post.title}`}
                      className="h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </section>
              )}

              <FaqSection items={post.faq} />

              <div className="my-12 lg:hidden">
                <AdBanner slot="post-main" format="horizontal" />
              </div>

              {related.length > 0 && (
                <section className="my-16 border-t border-border pt-12">
                  <h2 className="mb-10 text-2xl font-bold text-title tracking-tight">Deepen Your Discovery</h2>
                  <div className="grid gap-8 sm:grid-cols-2">
                    {related.slice(0, 2).map((rp) => (
                      <PostCard
                        key={rp.slug}
                        title={rp.title}
                        excerpt={rp.excerpt}
                        category={rp.category}
                        readTime={`${rp.reading_time}`}
                        slug={rp.slug}
                      />
                    ))}
                  </div>
                </section>
              )}

              <div className="my-16">
                <AuthorBox {...author} />
              </div>

              <div className="my-12">
                <Disclaimer />
              </div>
            </div>

            <aside className="hidden w-72 shrink-0 lg:block">
              <div className="sticky top-32 space-y-12">
                {sections.length > 1 && !showGate && <TableOfContents sections={sections} />}
                <AdBanner slot="post-sidebar" format="vertical" className="hidden lg:block rounded-2xl overflow-hidden" />
              </div>
            </aside>
          </div>
        </article>

        {showGate && (
          <div className="absolute inset-0 z-50 flex items-start justify-center bg-gradient-to-b from-transparent via-background/95 to-background pt-64">
            <div className="sticky top-48 max-w-md w-full bg-card border border-secondary/20 rounded-[2.5rem] p-10 text-center shadow-2xl mx-4">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
                <Lock className="h-8 w-8" />
              </div>
              <h2 className="text-3xl font-bold text-title mb-4 tracking-tight">
                Expand Your Internal Agency
              </h2>
              <p className="text-muted-foreground mb-10 text-md leading-relaxed">
                {post.is_premium 
                  ? "This deep blueprint is exclusive to PRO seekers. Subscribe to unlock clinical-grade insights and advanced self-mastery journeys."
                  : "You've reached your free insight limit for today. Create a free account to continue your journey or upgrade for unlimited mastery."}
              </p>
              <div className="flex flex-col gap-4">
                {post.is_premium && !user ? (
                   <Button asChild size="lg" variant="hero" className="rounded-full py-8 font-bold uppercase tracking-widest text-lg shadow-xl shadow-secondary/20">
                    <Link to="/login">Join ValidZen Free</Link>
                  </Button>
                ) : (post.is_premium && user) ? (
                  <Button asChild size="lg" variant="hero" className="rounded-full py-8 font-bold uppercase tracking-widest text-lg shadow-xl shadow-secondary/20">
                    <Link to="/pro">Upgrade to PRO</Link>
                  </Button>
                ) : (
                  <Button asChild size="lg" variant="hero" className="rounded-full py-8 font-bold uppercase tracking-widest text-lg shadow-xl shadow-primary/20">
                    <Link to="/login">Create Free Account</Link>
                  </Button>
                )}
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
