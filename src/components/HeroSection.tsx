import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/5" />

      <div className="container relative flex flex-col items-center py-20 text-center md:py-36">
        {/* Logo — semibold to match the PT original */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <span className="text-4xl font-semibold tracking-tight text-title md:text-7xl">
            valid<span className="text-secondary">zen</span>.
          </span>
        </motion.div>

        {/* Tag line — normal weight, spaced caps */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-4 text-xs font-normal uppercase tracking-[0.4em] text-secondary opacity-80"
        >
          THE MEANING CRISIS PROJECT
        </motion.p>

        {/* H1 — bold (not black), matches PT weight */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mx-auto mt-4 max-w-2xl text-2xl font-bold leading-tight tracking-tight text-title md:text-4xl"
        >
          Master your internal patterns,{" "}
          <span className="text-muted-foreground/60">reclaim your agency,</span>{" "}
          <span className="text-secondary/80">restore your balance.</span>
        </motion.h1>

        {/* Body copy — normal weight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mx-auto mt-8 max-w-xl"
        >
          <p className="text-base font-normal text-muted-foreground md:text-lg leading-relaxed">
            We combine clinical-grade blueprint insights with guided self-mastery to help you navigate life's complexities and rediscover what truly matters.
          </p>
        </motion.div>

        {/* CTA — responsive, no overflow on mobile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-10 w-full px-4 sm:px-0 sm:w-auto"
        >
          <Button
            asChild
            variant="hero"
            size="lg"
            className="w-full sm:w-auto rounded-full px-10 py-4 text-sm font-semibold uppercase tracking-widest shadow-xl shadow-secondary/20 transition-all hover:scale-105 active:scale-95"
          >
            <Link to="/quizzes">Begin Your Discovery Journey</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
