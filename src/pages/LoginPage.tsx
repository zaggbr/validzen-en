import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Check, ArrowLeft } from "lucide-react";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const from = location.state?.from || "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);

  useEffect(() => {
    // Detect if we are in a recovery flow
    supabase.auth.onAuthStateChange(async (event) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsRecovery(true);
      }
    });

    // Check URL fragment for recovery type
    if (window.location.hash.includes("type=recovery") || window.location.href.includes("type=recovery")) {
      setIsRecovery(true);
    }
  }, []);

  const benefits = [
    "Preserve and monitor your Discovery History",
    "Unlock exclusive guided self-mastery content",
    "Receive personalized psychological blueprints",
    "Access clinical-grade deep pattern assessments",
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast({ 
        title: "We couldn't sign you in", 
        description: "Please check your credentials or share your correct email so we can continue your journey.", 
        variant: "destructive" 
      });
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
        emailRedirectTo: `${window.location.origin}/auth/v1/callback`,
      },
    });
    setLoading(false);
    if (error) {
      toast({ 
        title: "Journey Initialization Failed", 
        description: error.message, 
        variant: "destructive" 
      });
    } else {
      toast({ 
        title: "Welcome to ValidZen!", 
        description: "We've sent a confirmation to your email. Please verify it to begin your discovery journey." 
      });
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      toast({
        title: "Email required",
        description: "Please share your email address so we can send you a reset link.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });
    setLoading(false);
    
    if (error) {
      toast({ title: "Reset Failed", description: error.message, variant: "destructive" });
    } else {
      toast({ 
        title: "Reset link sent!", 
        description: "Check your email for the link to share your new password." 
      });
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast({ title: "Weak password", description: "Must be at least 6 characters.", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast({ title: "Update Failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success!", description: "Your password has been updated. You can now continue your journey." });
      setIsRecovery(false);
      navigate("/dashboard");
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/v1/callback`,
      },
    });
    if (error) {
      toast({ title: "Google Authentication Failed", description: error.message, variant: "destructive" });
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <Link to="/dashboard" className="mb-10 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-secondary transition-colors">
            <ArrowLeft className="h-4 w-4" /> Dashboard
          </Link>
          <h1 className="mb-2 text-3xl font-bold text-title">
            valid<span className="text-secondary">zen</span>.
          </h1>
          <p className="mb-10 text-sm text-muted-foreground">Your journey to emotional self-mastery starts here.</p>

          <Button variant="outline" className="mb-8 w-full gap-3 py-6 rounded-xl border-border/50 hover:bg-secondary/5 transition-all font-bold" onClick={handleGoogleLogin}>
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </Button>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-[0.2em]">
              <span className="bg-background px-4 text-muted-foreground">or use your email</span>
            </div>
          </div>

          {isRecovery ? (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-title">New Password</h2>
                <p className="text-sm text-muted-foreground mt-2">Share your new private key to regain access.</p>
              </div>
              <form onSubmit={handleUpdatePassword} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="new-password" title="Must be at least 6 characters" className="text-xs font-bold uppercase tracking-widest opacity-70">New Password</Label>
                  <Input id="new-password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="h-12 rounded-xl" />
                </div>
                <Button type="submit" className="w-full py-7 rounded-xl font-bold uppercase tracking-widest shadow-xl shadow-primary/20" disabled={loading}>
                  {loading ? "Updating..." : "Update Password & Continue"}
                </Button>
                <button type="button" onClick={() => setIsRecovery(false)} className="w-full text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-secondary">
                  Cancel
                </button>
              </form>
            </div>
          ) : (
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="mb-6 w-full p-1 bg-muted/30 rounded-xl">
                <TabsTrigger value="login" className="flex-1 rounded-lg font-bold uppercase text-[10px] tracking-widest py-3">Login</TabsTrigger>
                <TabsTrigger value="signup" className="flex-1 rounded-lg font-bold uppercase text-[10px] tracking-widest py-3">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-xs font-bold uppercase tracking-widest opacity-70">Email Address</Label>
                    <Input id="login-email" type="email" placeholder="Please share your email" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-12 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="login-password" title="Your private key" className="text-xs font-bold uppercase tracking-widest opacity-70">Password</Label>
                      <button 
                        type="button" 
                        onClick={handleResetPassword}
                        className="text-[10px] font-bold uppercase tracking-widest text-secondary hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <Input id="login-password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="h-12 rounded-xl" />
                  </div>
                  <Button type="submit" className="w-full py-7 rounded-xl font-bold uppercase tracking-widest shadow-xl shadow-primary/20" disabled={loading}>
                    {loading ? "Gathering Insights..." : "Continue My Journey"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="text-xs font-bold uppercase tracking-widest opacity-70">Full Name</Label>
                    <Input id="signup-name" type="text" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required className="h-12 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-xs font-bold uppercase tracking-widest opacity-70">Email Address</Label>
                    <Input id="signup-email" type="email" placeholder="Please share your email" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-12 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" title="Must be at least 6 characters" className="text-xs font-bold uppercase tracking-widest opacity-70">Password</Label>
                    <Input id="signup-password" type="password" placeholder="Choose a strong password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="h-12 rounded-xl" />
                  </div>
                  <Button type="submit" className="w-full py-7 rounded-xl font-bold uppercase tracking-widest shadow-xl shadow-primary/20" disabled={loading}>
                    {loading ? "Initializing..." : "Begin My Discovery Journey"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>

      <div className="hidden flex-1 flex-col items-center justify-center bg-primary p-16 lg:flex relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-secondary/20" />
        <div className="relative z-10 max-w-md">
          <h2 className="mb-3 text-4xl font-bold text-primary-foreground tracking-tight">Your Internal Agency</h2>
          <p className="mb-10 text-md text-primary-foreground/80 leading-relaxed">We’ve gathered thousands of seekers to map their unique patterns and find clarity in a complex world.</p>
          <ul className="space-y-6">
            {benefits.map((b) => (
              <li key={b} className="flex items-start gap-4 text-sm text-primary-foreground font-bold">
                <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary/20">
                  <Check className="h-3 w-3 text-secondary" />
                </div>
                {b}
              </li>
            ))}
          </ul>
          <div className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm shadow-2xl">
            <p className="text-md text-white/70 leading-relaxed">"ValidZen helped me understand patterns I've been carrying for years. It's more than a journey, it's a mirror for the soul."</p>
            <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/90">— Sarah J., Member since 2023</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
