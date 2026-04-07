import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Crown, ArrowRight, Clock, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { usePremiumAssessmentForPost } from "@/hooks/usePremiumAssessment";
import { useI18n } from "@/i18n/I18nContext";
import { useAuth } from "@/contexts/AuthContext";
import PremiumAssessmentFlow from "./PremiumAssessmentFlow";

interface PremiumAssessmentCTAProps {
  postSlug: string;
}

const PremiumAssessmentCTA = ({ postSlug }: PremiumAssessmentCTAProps) => {
  const { locale, localePath } = useI18n();
  const navigate = useNavigate();
  const { isPremium } = useAuth();
  const { data: assessment } = usePremiumAssessmentForPost(postSlug);
  const [showFlow, setShowFlow] = useState(false);

  if (!assessment) return null;

  const title = locale === "en" ? assessment.title_en : assessment.title_pt;
  const description = locale === "en" ? assessment.description_en : assessment.description_pt;

  return (
    <>
      <div className="my-10 overflow-hidden rounded-2xl border border-accent/20 bg-gradient-to-br from-accent/5 via-background to-primary/5 p-6 md:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10">
            <Crown className="h-6 w-6 text-accent" />
          </div>
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <h3 className="text-lg font-bold text-title">{title}</h3>
              <Badge variant="secondary" className="bg-accent/15 text-accent text-xs font-bold">
                PRO
              </Badge>
            </div>
            <p className="mb-3 text-sm text-muted-foreground leading-relaxed">{description}</p>
            <div className="flex gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {assessment.estimated_time} min
              </span>
              <span className="flex items-center gap-1">
                <Lock className="h-3.5 w-3.5" />
                {locale === "pt" ? "Assessment profundo" : "Deep assessment"}
              </span>
            </div>
          </div>
          <Button onClick={() => setShowFlow(true)} variant="hero" size="lg" className="shrink-0">
            {isPremium 
              ? (locale === "pt" ? "Começar" : "Start") 
              : (locale === "pt" ? "Desbloquear" : "Unlock")}
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>

      <Dialog open={showFlow} onOpenChange={setShowFlow}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <PremiumAssessmentFlow
            assessmentSlug={assessment.slug}
            onComplete={() => {
              setShowFlow(false);
              navigate(localePath("/dashboard"));
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PremiumAssessmentCTA;
