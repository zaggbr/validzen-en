import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Crown, ArrowRight, Clock, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { usePremiumAssessmentForPost } from "@/hooks/usePremiumAssessment";
import { useAuth } from "@/contexts/AuthContext";
import PremiumAssessmentFlow from "./PremiumAssessmentFlow";

interface PremiumAssessmentCTAProps {
  postSlug: string;
}

const PremiumAssessmentCTA = ({ postSlug }: PremiumAssessmentCTAProps) => {
  const navigate = useNavigate();
  const { isPremium } = useAuth();
  const { data: assessment } = usePremiumAssessmentForPost(postSlug);
  const [showFlow, setShowFlow] = useState(false);

  if (!assessment) return null;

  const title = assessment.title_en || assessment.title_pt;
  const description = assessment.description_en || assessment.description_pt;

  return (
    <>
      <div className="my-12 overflow-hidden rounded-[2rem] border border-secondary/20 bg-gradient-to-br from-secondary/5 via-background to-primary/5 p-8 md:p-10 shadow-xl shadow-secondary/5">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-secondary shadow-lg shadow-secondary/20">
            <Crown className="h-8 w-8 text-white" />
          </div>
          <div className="flex-1">
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <h3 className="text-xl font-black text-title italic tracking-tight">{title}</h3>
              <Badge variant="secondary" className="bg-secondary/10 text-secondary text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 italic">
                PRO Discovery
              </Badge>
            </div>
            <p className="mb-6 text-md text-muted-foreground italic leading-relaxed">{description}</p>
            <div className="flex gap-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-70">
              <span className="flex items-center gap-1.5 italic">
                <Clock className="h-3.5 w-3.5 text-secondary" />
                {assessment.estimated_time} Min
              </span>
              <span className="flex items-center gap-1.5 italic">
                <Lock className="h-3.5 w-3.5 text-secondary" />
                Clinical-Grade Blueprint
              </span>
            </div>
          </div>
          <Button onClick={() => setShowFlow(true)} variant="hero" size="lg" className="rounded-full px-8 py-7 font-black uppercase tracking-widest text-md shadow-2xl shadow-secondary/20 transition-all hover:scale-105 active:scale-95 shrink-0">
            {isPremium ? "Begin Journey" : "Reveal My Blueprint"}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>

      <Dialog open={showFlow} onOpenChange={setShowFlow}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] border-secondary/20 shadow-2xl">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-3xl font-black text-title italic tracking-tight">{title}</DialogTitle>
            <DialogDescription className="text-md italic text-muted-foreground leading-relaxed pt-2">
              {description}
            </DialogDescription>
          </DialogHeader>
          <PremiumAssessmentFlow
            assessmentSlug={assessment.slug}
            onComplete={() => {
              setShowFlow(false);
              navigate("/dashboard");
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PremiumAssessmentCTA;
