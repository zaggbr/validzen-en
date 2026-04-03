import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Check, ArrowLeft } from "lucide-react";
import { useI18n } from "@/i18n/I18nContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { t, localePath } = useI18n();
  const from = location.state?.from || localePath("/");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const benefits = [
    t("login.benefit_1"),
    t("login.benefit_2"),
    t("login.benefit_3"),
    t("login.benefit_4"),
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast({ title: t("login.error_login"), description: error.message, variant: "destructive" });
    } else {
      navigate(from, { replace: true });
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${window.location.origin}${from}`,
      },
    });
    setLoading(false);
    if (error) {
      toast({ title: t("login.error_signup"), description: error.message, variant: "destructive" });
    } else {
      toast({ title: t("login.success_signup"), description: t("login.success_signup_desc") });
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}${from}`,
      },
    });
    if (error) {
      toast({ title: t("login.error_google"), description: error.message, variant: "destructive" });
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <h1 className="mb-1 text-2xl font-bold text-title">
            valid<span className="text-secondary">zen</span>.
          </h1>
          <p className="mb-8 text-sm text-muted-foreground">{t("login.tagline")}</p>

          <Button variant="outline" className="mb-6 w-full gap-2" onClick={handleGoogleLogin}>
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            {t("login.google")}
          </Button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-background px-2 text-muted-foreground">{t("login.or")}</span>
            </div>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="mb-4 w-full">
              <TabsTrigger value="login" className="flex-1">{t("login.tab_login")}</TabsTrigger>
              <TabsTrigger value="signup" className="flex-1">{t("login.tab_signup")}</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="login-email">{t("login.email")}</Label>
                  <Input id="login-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="login-password">{t("login.password")}</Label>
                  <Input id="login-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? t("login.submit_login_loading") : t("login.submit_login")}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <Label htmlFor="signup-name">{t("login.name")}</Label>
                  <Input id="signup-name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="signup-email">{t("login.email")}</Label>
                  <Input id="signup-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="signup-password">{t("login.password")}</Label>
                  <Input id="signup-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? t("login.submit_signup_loading") : t("login.submit_signup")}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="hidden flex-1 items-center justify-center bg-primary p-12 lg:flex">
        <div className="max-w-md">
          <h2 className="mb-2 text-3xl font-bold text-primary-foreground">{t("login.benefits_title")}</h2>
          <p className="mb-8 text-sm text-primary-foreground/70">{t("login.benefits_subtitle")}</p>
          <ul className="space-y-4">
            {benefits.map((b) => (
              <li key={b} className="flex items-start gap-3 text-sm text-primary-foreground/90">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                {b}
              </li>
            ))}
          </ul>
          <div className="mt-10 rounded-lg border border-primary-foreground/10 bg-primary-foreground/5 p-5">
            <p className="text-xs italic text-primary-foreground/60">"{t("login.testimonial")}"</p>
            <p className="mt-2 text-xs font-medium text-primary-foreground/80">{t("login.testimonial_author")}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
