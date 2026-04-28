import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "true");
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-2xl"
        >
          <div className="flex flex-col items-center justify-between gap-4 rounded-xl border border-border bg-background/80 p-4 shadow-lg backdrop-blur-md md:flex-row md:py-3">
            <p className="text-center text-xs text-muted-foreground md:text-left">
              We use cookies to enhance your experience and analyze our traffic. We respect your privacy and never sell your data.
            </p>
            <Button 
              onClick={handleAccept} 
              size="sm" 
              className="h-8 rounded-lg bg-title text-[10px] font-bold uppercase tracking-widest hover:bg-title/90 px-6 transition-all"
            >
              Accept
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
