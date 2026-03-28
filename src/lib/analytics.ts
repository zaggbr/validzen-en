// Google Analytics 4 utilities

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export function initGA(measurementId: string) {
  if (!measurementId || typeof window === "undefined") return;

  // Load gtag script
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function (...args: any[]) {
    window.dataLayer!.push(args);
  };
  window.gtag("js", new Date());
  window.gtag("config", measurementId, { send_page_view: false });
}

export function trackPageView(path: string, title: string) {
  window.gtag?.("event", "page_view", {
    page_path: path,
    page_title: title,
  });
}

export function trackEvent(name: string, params?: Record<string, any>) {
  window.gtag?.("event", name, params);
}

// Custom events
export const analytics = {
  quizStarted: (quizSlug: string) =>
    trackEvent("quiz_started", { quiz_slug: quizSlug }),
  quizCompleted: (quizSlug: string, overallScore?: number) =>
    trackEvent("quiz_completed", { quiz_slug: quizSlug, overall_score: overallScore }),
  postRead: (slug: string, percentage: number) =>
    trackEvent("post_read", { post_slug: slug, read_percentage: percentage }),
  videoWatched: (slug: string) =>
    trackEvent("video_watched", { post_slug: slug }),
  proUpgradeClicked: (source: string) =>
    trackEvent("pro_upgrade_clicked", { source }),
  proSubscribed: (plan: string) =>
    trackEvent("pro_subscribed", { plan }),
};
