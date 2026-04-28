import { Link } from "react-router-dom";
import { Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card/30 backdrop-blur-sm">
      <div className="container py-16 md:py-24">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <span className="text-2xl font-semibold text-title tracking-tight">
              valid<span className="text-secondary">zen</span>.
            </span>
            <p className="mt-4 max-w-sm text-md text-muted-foreground leading-relaxed">Meaningful self-mastery for a clearer mind. We help you navigate your unique psychological patterns.</p>
            <p className="mt-2 text-xs font-normal uppercase tracking-[0.2em] text-muted-foreground opacity-60">The Meaning Crisis Project — Insights for the modern soul.</p>
            <div className="mt-6 flex gap-4">
              <a href="https://instagram.com/validzen" target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted/50 text-muted-foreground hover:bg-secondary hover:text-white transition-all">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-foreground">Discovery Map</span>
            <nav className="flex flex-col gap-3">
              <Link to="/about" className="text-sm font-bold text-muted-foreground hover:text-secondary transition-colors">Our Methodology</Link>
              <Link to="/quizzes" className="text-sm font-bold text-muted-foreground hover:text-secondary transition-colors">Core Journeys</Link>
              <Link to="/pro" className="text-sm font-bold text-muted-foreground hover:text-secondary transition-colors">ValidZen PRO</Link>
              <a href="mailto:info@validzen.com" className="text-sm font-bold text-muted-foreground hover:text-secondary transition-colors">Contact Support</a>
            </nav>
          </div>

          <div className="flex flex-col gap-4">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-foreground">Important</span>
            <nav className="flex flex-col gap-3">
              <Link to="/terms" className="text-sm font-bold text-muted-foreground hover:text-secondary transition-colors">Terms of Service</Link>
              <Link to="/privacy" className="text-sm font-bold text-muted-foreground hover:text-secondary transition-colors">Privacy Policy</Link>
              <div className="mt-2 space-y-4">
                 <p className="text-[10px] text-muted-foreground leading-relaxed opacity-70">Our blueprints are for educational discovery. They do not replace clinical diagnosis.</p>
                 <p className="text-[10px] font-bold uppercase tracking-widest text-secondary leading-relaxed">In emergency, please contact your local crisis hotline.</p>
              </div>
            </nav>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-border pt-10 md:flex-row">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground opacity-50">
            © {new Date().getFullYear()} ValidZen Global. All rights reserved.
          </p>
          <div className="flex gap-6">
             <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-40">English-First (v2.0)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
