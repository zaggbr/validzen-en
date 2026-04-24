import { useEffect } from "react";

interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  noindex?: boolean;
  type?: "website" | "article";
  image?: string;
  publishedAt?: string;
  updatedAt?: string;
  authorName?: string;
  faq?: { question: string; answer: string }[];
  breadcrumbs?: { name: string; url: string }[];
}

const SITE_URL = "https://mymap.validzen.com";
const DEFAULT_IMAGE = "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/e0ac6d82-a8c1-47d4-b61e-995f6e9306ad/id-preview-50321adc--f56c5f96-ebf3-481f-8def-b724d0ed6ec4.lovable.app-1774536337531.png";

const SEOHead = ({
  title,
  description,
  canonical,
  noindex = false,
  type = "website",
  image = DEFAULT_IMAGE,
  publishedAt,
  updatedAt,
  authorName,
  faq,
  breadcrumbs,
}: SEOHeadProps) => {
  const canonicalUrl = canonical || window.location.href;

  useEffect(() => {
    document.title = title;

    const setMeta = (name: string, content: string, property = false) => {
      const attr = property ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    setMeta("description", description);
    setMeta("og:title", title, true);
    setMeta("og:description", description, true);
    setMeta("og:type", type, true);
    setMeta("og:image", image, true);
    setMeta("og:url", canonicalUrl, true);
    setMeta("og:locale", "en_US", true);
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);
    setMeta("twitter:image", image);

    // Robots
    if (noindex) {
      setMeta("robots", "noindex, nofollow");
    } else {
      const existing = document.querySelector('meta[name="robots"]');
      if (existing) existing.remove();
    }

    // Canonical
    let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalEl) {
      canonicalEl = document.createElement("link");
      canonicalEl.rel = "canonical";
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.href = canonicalUrl;

    // Hreflang - Simplified to English only
    let elEn = document.querySelector('link[hreflang="en"]') as HTMLLinkElement | null;
    if (!elEn) {
      elEn = document.createElement("link");
      elEn.rel = "alternate";
      elEn.hreflang = "en";
      document.head.appendChild(elEn);
    }
    elEn.href = canonicalUrl;

    // JSON-LD
    const existingLd = document.getElementById("validzen-jsonld");
    if (existingLd) existingLd.remove();

    const jsonLdItems: object[] = [];

    if (breadcrumbs && breadcrumbs.length > 0) {
      jsonLdItems.push({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbs.map((b, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: b.name,
          item: b.url,
        })),
      });
    }

    if (type === "article") {
      jsonLdItems.push({
        "@context": "https://schema.org",
        "@type": "Article",
        headline: title,
        description,
        image,
        ...(authorName && { author: { "@type": "Person", name: authorName } }),
        ...(publishedAt && { datePublished: publishedAt }),
        ...(updatedAt && { dateModified: updatedAt }),
        publisher: { "@type": "Organization", name: "ValidZen" },
      });
    }

    if (faq && faq.length > 0) {
      jsonLdItems.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faq.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      });
    }

    if (type === "website") {
      jsonLdItems.push({
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "ValidZen",
        url: SITE_URL,
        potentialAction: {
          "@type": "SearchAction",
          target: `${SITE_URL}/categories?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      });
    }

    if (jsonLdItems.length > 0) {
      const script = document.createElement("script");
      script.id = "validzen-jsonld";
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(
        jsonLdItems.length === 1 ? jsonLdItems[0] : jsonLdItems
      );
      document.head.appendChild(script);
    }

    return () => {
      const ld = document.getElementById("validzen-jsonld");
      if (ld) ld.remove();
    };
  }, [title, description, canonical, noindex, type, image, canonicalUrl, publishedAt, updatedAt, authorName, faq, breadcrumbs]);

  return null;
};

export default SEOHead;
