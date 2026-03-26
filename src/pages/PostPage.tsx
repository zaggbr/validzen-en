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
import { getPostBySlug, getRelatedPosts } from "@/data/posts";
import { ChevronRight, Clock, Calendar } from "lucide-react";

const PostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : undefined;

  if (!post) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <span className="text-5xl">📄</span>
            <h1 className="mt-4 text-2xl font-bold">Post não encontrado</h1>
            <Link to="/" className="mt-4 inline-block text-sm text-secondary hover:underline">
              Voltar para Home
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const related = getRelatedPosts(post.relatedPosts);
  const url = `https://validzen.app/pt/conteudo/${post.slug}`;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <article className="container py-8 md:py-12">
          {/* 1. Breadcrumb */}
          <nav className="mb-6 flex items-center gap-1 text-xs text-muted-foreground" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to={`/categoria/${post.categorySlug}`} className="hover:text-foreground transition-colors">
              {post.category}
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground line-clamp-1">{post.title}</span>
          </nav>

          {/* 2. Header */}
          <header className="mb-8 max-w-3xl">
            <div className="mb-3 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-secondary/10 px-2.5 py-0.5 text-xs font-medium text-secondary"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-2xl font-bold leading-tight md:text-4xl">{post.title}</h1>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span>Por {post.author.name}</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Atualizado em {new Date(post.updatedAt).toLocaleDateString("pt-BR")}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {post.readingTime} min de leitura
              </span>
              {post.isPremium && (
                <span className="rounded bg-accent/20 px-2 py-0.5 text-xs font-bold text-accent">PRO</span>
              )}
            </div>
            <div className="mt-4">
              <ShareButtons title={post.title} url={url} />
            </div>
          </header>

          {/* 3. Featured snippet */}
          <div className="mb-8 max-w-3xl rounded-lg border-l-4 border-secondary bg-muted/50 px-6 py-5">
            <p className="text-sm leading-relaxed text-foreground">{post.excerpt}</p>
          </div>

          {/* Layout: content + sidebar TOC */}
          <div className="flex gap-10">
            <div className="min-w-0 max-w-3xl flex-1">
              {/* 4. TOC mobile */}
              <div className="mb-8 lg:hidden">
                <TableOfContents sections={post.sections} />
              </div>

              {/* 5. Content sections */}
              {post.sections.map((section, i) => (
                <div key={section.id}>
                  <section id={section.id} className="mb-8 scroll-mt-24">
                    <h2 className="mb-4 text-xl font-bold md:text-2xl">{section.heading}</h2>
                    <div
                      className="prose-validzen"
                      dangerouslySetInnerHTML={{ __html: section.body }}
                    />
                  </section>

                  {/* Quiz inline — show once on the first quizAfter section */}
                  {section.quizAfter && post.quizSlug && (
                    <QuizInline
                      quizSlug={post.quizSlug}
                      title={`Qual o seu nível de ${post.category.toLowerCase()}?`}
                      subtitle={`Responda algumas perguntas rápidas sobre ${post.category.toLowerCase()}`}
                    />
                  )}
                </div>
              ))}

              {/* Bottom quiz CTA banner */}
              {post.quizSlug && (
                <QuizCTA theme={post.category.toLowerCase()} quizSlug={post.quizSlug} />
              )}

              {/* 7. Video embed */}
              {post.videoUrl && (
                <section className="my-10">
                  <h2 className="mb-4 text-xl font-bold">Vídeo relacionado</h2>
                  <div className="aspect-video overflow-hidden rounded-lg border border-border">
                    <iframe
                      src={post.videoUrl}
                      title={`Vídeo: ${post.title}`}
                      className="h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </section>
              )}

              {/* 8. FAQ */}
              <FaqSection items={post.faq} />

              {/* 9. Related posts */}
              {related.length > 0 && (
                <section className="my-10">
                  <h2 className="mb-6 text-xl font-bold">Conteúdo relacionado</h2>
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

              {/* 10. Author box */}
              <div className="my-10">
                <AuthorBox {...post.author} />
              </div>

              {/* 11. Disclaimer */}
              <div className="my-10">
                <Disclaimer />
              </div>
            </div>

            {/* Desktop sidebar TOC */}
            <aside className="hidden w-64 shrink-0 lg:block">
              <TableOfContents sections={post.sections} />
            </aside>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default PostPage;
