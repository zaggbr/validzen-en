import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/I18nContext";

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { locale } = useI18n();

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      // Show with a small delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "true");
    setIsVisible(false);
  };

  const text = locale === "pt" 
    ? "Usamos cookies para melhorar sua experiência. Não vendemos seus dados para ninguém."
    : "We use cookies to improve your experience. We do not sell your data to anyone.";

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
              {text}
            </p>
            <Button 
              onClick={handleAccept} 
              size="sm" 
              className="h-8 rounded-lg bg-title text-xs font-semibold hover:bg-title/90 px-6 transition-all"
            >
              OK
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
