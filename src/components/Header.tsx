import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Moon, Sun, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/i18n/I18nContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { t, localePath } = useI18n();

  const toggleDark = () => {
    setDark(!dark);
    document.documentElement.classList.toggle("dark");
  };

  const handleSignOut = async () => {
    await signOut();
    navigate(localePath("/"));
  };

  const navLinks = [
    { label: t("nav.themes"), href: localePath("/categorias") },
    ...(user ? [
      { label: t("nav.quiz"), href: localePath("/quiz/geral") },
      { label: t("nav.dashboard"), href: localePath("/dashboard") },
    ] : []),
    { label: t("nav.pro"), href: localePath("/pro") },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to={localePath("/")} className="flex items-center gap-1">
          <span className="text-xl font-bold tracking-tight text-title">
            valid<span className="text-secondary">zen</span>.
          </span>
        </Link>

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
          <LanguageSwitcher />
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                {user.user_metadata?.full_name || user.email}
              </span>
              <Button size="sm" variant="outline" onClick={handleSignOut}>
                <LogOut className="mr-1 h-3 w-3" /> {t("nav.logout")}
              </Button>
            </div>
          ) : (
            <Button size="sm" variant="outline" asChild>
              <Link to={localePath("/login")}>{t("nav.login")}</Link>
            </Button>
          )}
        </div>

        <button
          className="rounded-lg p-2 text-muted-foreground md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

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
              <LanguageSwitcher />
              {user ? (
                <Button size="sm" variant="outline" className="ml-auto" onClick={handleSignOut}>
                  <LogOut className="mr-1 h-3 w-3" /> {t("nav.logout")}
                </Button>
              ) : (
                <Button size="sm" variant="outline" className="ml-auto" asChild>
                  <Link to={localePath("/login")} onClick={() => setMobileOpen(false)}>{t("nav.login")}</Link>
                </Button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
