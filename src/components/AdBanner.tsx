import { useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface AdBannerProps {
  slot: string;
  format: "horizontal" | "vertical" | "rectangle" | "in-article";
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

const formatToStyle: Record<AdBannerProps["format"], { minHeight: string; maxWidth?: string }> = {
  horizontal: { minHeight: "90px" },
  vertical: { minHeight: "600px", maxWidth: "160px" },
  rectangle: { minHeight: "250px", maxWidth: "336px" },
  "in-article": { minHeight: "250px" },
};

const AdBanner = ({ slot, format, className = "" }: AdBannerProps) => {
  const { isPremium } = useAuth();
  const adRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (isPremium || pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // AdSense not loaded yet or blocked
    }
  }, [isPremium]);

  if (isPremium) return null;

  const clientId = import.meta.env.VITE_ADSENSE_CLIENT_ID;
  if (!clientId) {
    return (
      <div className={`mx-auto flex items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 text-[10px] uppercase tracking-widest text-muted-foreground/60 ${className}`}
        style={{ ...formatToStyle[format], width: "100%" }}
      >
        <span>Advertisement</span>
      </div>
    );
  }

  const adFormat = format === "in-article" ? "fluid" : "auto";
  const adLayout = format === "in-article" ? "in-article-ad" : undefined;

  return (
    <div className={`mx-auto ${className}`} style={{ width: "100%" }}>
      <span className="mb-1 block text-center text-[10px] uppercase tracking-widest text-muted-foreground/60">
        Advertisement
      </span>
      <ins
        ref={adRef}
        className="adsbygoogle block"
        style={{ display: "block", textAlign: "center", ...formatToStyle[format], width: "100%" }}
        data-ad-client={clientId}
        data-ad-slot={slot}
        data-ad-format={adFormat}
        data-ad-layout={adLayout}
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default AdBanner;
