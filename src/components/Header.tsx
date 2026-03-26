import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(false);

  const toggleDark = () => {
    setDark(!dark);
    document.documentElement.classList.toggle("dark");
  };

  const navLinks = [
    { label: "Temas", href: "/categorias" },
    { label: "Quiz", href: "/quiz/geral" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Pro", href: "/pro" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-1">
          <span className="text-xl font-bold tracking-tight text-title">
            valid<span className="text-secondary">zen</span>.
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <button
            onClick={toggleDark}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Toggle theme"
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <span className="text-xs font-medium text-muted-foreground">PT | EN</span>
          <Button size="sm" variant="outline">
            Entrar
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className="rounded-lg p-2 text-muted-foreground md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-background px-4 pb-4 pt-2 md:hidden">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-3 pt-2">
              <button onClick={toggleDark} className="rounded-lg p-2 text-muted-foreground hover:bg-muted">
                {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <span className="text-xs font-medium text-muted-foreground">PT | EN</span>
              <Button size="sm" variant="outline" className="ml-auto">
                Entrar
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
