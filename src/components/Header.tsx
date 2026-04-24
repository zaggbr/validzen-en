import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Moon, Sun, LogOut, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const { user, isAdmin, isPremium, signOut } = useAuth();
  const navigate = useNavigate();

  const toggleDark = () => {
    setDark(!dark);
    document.documentElement.classList.toggle("dark");
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const navLinks = [
    { label: "Discovery", href: "/categories" },
    { label: "Journeys", href: "/quizzes" },
    ...(user ? [
      { label: "Blueprint", href: "/dashboard" },
    ] : []),
    ...(isAdmin ? [{ label: "Admin", href: "/admin" }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-1">
          <span className="text-xl font-black tracking-tight text-title italic">
            valid<span className="text-secondary">zen</span>.
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground transition-all hover:text-secondary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <button
            onClick={toggleDark}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-secondary"
            aria-label="Toggle theme"
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          
          {user ? (
            <div className="flex items-center gap-4">
              {!isPremium && (
                <Button size="sm" variant="hero" asChild className="h-8 px-4 text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-secondary/20">
                  <Link to="/pro"><Crown className="mr-1.5 h-3 w-3" /> Upgrade</Link>
                </Button>
              )}
              <Button size="sm" variant="ghost" onClick={handleSignOut} className="text-xs font-bold text-muted-foreground hover:text-destructive">
                <LogOut className="mr-1.5 h-3.5 w-3.5" /> Sign Out
              </Button>
            </div>
          ) : (
            <Button size="sm" variant="hero" asChild className="h-9 px-6 text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-primary/20">
              <Link to="/login">Begin Journey</Link>
            </Button>
          )}
        </div>

        <button
          className="rounded-lg p-2 text-muted-foreground md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-background px-6 pb-8 pt-4 md:hidden animate-in slide-in-from-top duration-300">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="rounded-xl px-4 py-3 text-sm font-black uppercase tracking-[0.1em] text-muted-foreground transition-colors hover:bg-secondary/10 hover:text-secondary"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-4 pt-4 border-t border-border">
              {user ? (
                <div className="space-y-4">
                   {!isPremium && (
                    <Button size="lg" variant="hero" asChild className="w-full font-black uppercase tracking-widest">
                      <Link to="/pro" onClick={() => setMobileOpen(false)}>Upgrade to PRO</Link>
                    </Button>
                  )}
                  <Button size="lg" variant="outline" className="w-full font-black uppercase tracking-widest border-border" onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" /> Sign Out
                  </Button>
                </div>
              ) : (
                <Button size="lg" variant="hero" className="w-full font-black uppercase tracking-widest" asChild>
                  <Link to="/login" onClick={() => setMobileOpen(false)}>Begin Journey</Link>
                </Button>
              )}
              
              <div className="flex items-center justify-center gap-4 pt-2">
                <button onClick={toggleDark} className="flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold text-muted-foreground bg-muted/30">
                  {dark ? <><Sun className="h-4 w-4" /> Light Mode</> : <><Moon className="h-4 w-4" /> Dark Mode</>}
                </button>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
