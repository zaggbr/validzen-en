import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/5" />

      <div className="container relative flex flex-col items-center py-24 text-center md:py-40">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <span className="text-5xl font-black tracking-tight text-title md:text-8xl italic">
            valid<span className="text-secondary">zen</span>.
          </span>
        </motion.div>

        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-4 text-xs font-black uppercase tracking-[0.4em] text-secondary opacity-80"
        >
          THE MEANING CRISIS PROJECT
        </motion.p>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mx-auto mt-4 max-w-3xl text-3xl font-black leading-[1.1] text-title md:text-6xl italic tracking-tight"
        >
          Master your internal patterns,{" "}
          <span className="text-muted-foreground/60">reclaim your agency,</span>{" "}
          <span className="text-secondary/80">restore your balance.</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mx-auto mt-10 max-w-2xl"
        >
          <p className="text-lg text-muted-foreground md:text-xl italic leading-relaxed">
            We combine clinical-grade blueprint insights with guided self-mastery to help you navigate life's complexities and rediscover what truly matters.
          </p>
          <p className="mt-4 text-sm font-black uppercase tracking-[0.2em] text-title italic opacity-70">
            Meaningful self-knowledge for the modern soul.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12"
        >
          <Button asChild variant="hero" size="xl" className="rounded-full px-12 py-9 text-xl font-black uppercase tracking-widest shadow-2xl shadow-secondary/20 transition-all hover:scale-105 active:scale-95">
            <Link to="/quizzes">Begin Your Discovery Journey</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
