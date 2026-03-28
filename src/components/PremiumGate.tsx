import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Crown, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/i18n/I18nContext";

interface PremiumGateProps {
  children: ReactNode;
  fallbackMessage?: string;
}

const PremiumGate = ({ children, fallbackMessage }: PremiumGateProps) => {
  const { isPremium } = useAuth();
  const { t, localePath } = useI18n();

  if (isPremium) return <>{children}</>;

  return (
    <div className="relative">
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-xl bg-background/70 backdrop-blur-md">
        <Crown className="mb-3 h-10 w-10 text-secondary" />
        <h3 className="mb-1 text-lg font-bold text-title">
          {fallbackMessage || t("pro.unlock_title")}
        </h3>
        <p className="mb-4 max-w-sm text-center text-sm text-muted-foreground">
          {t("pro.unlock_desc")}
        </p>
        <Button variant="hero" size="lg" asChild>
          <Link to={localePath("/pro")}>
            <Lock className="mr-1.5 h-4 w-4" /> {t("pro.upgrade_cta")}
          </Link>
        </Button>
      </div>
      <div className="pointer-events-none select-none">{children}</div>
    </div>
  );
};

export default PremiumGate;
