import { createContext, useContext, useEffect, useState, useRef, useCallback, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { migrateAnonymousResults } from "@/lib/anonymousSession";
import type { UserProfile } from "@/types/database";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  isPremium: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
  refreshSubscription: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  loading: true,
  isPremium: false,
  isAdmin: false,
  signOut: async () => {},
  refreshSubscription: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const migrated = useRef(false);

  const fetchProfile = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (data) {
      setProfile(data as UserProfile);
      setIsPremium(data.is_premium === true);
    }
  }, []);

  const refreshSubscription = useCallback(async () => {
    try {
      const { data, error } = await supabase.functions.invoke("check-subscription");
      if (!error && data) {
        setIsPremium(data.subscribed === true);
      }
    } catch {
      // silently fail
    }
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        if (session?.user) {
          setIsAdmin(session.user.email === "continentemedia@gmail.com");
          // Fetch profile
          setTimeout(() => fetchProfile(session.user.id), 0);

          if (!migrated.current) {
            migrated.current = true;
            migrateAnonymousResults(session.user.id);
          }

          setTimeout(() => refreshSubscription(), 0);
        } else {
          setProfile(null);
          setIsPremium(false);
          setIsAdmin(false);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [refreshSubscription, fetchProfile]);

  useEffect(() => {
    if (!user) return;
    const interval = setInterval(refreshSubscription, 60_000);
    return () => clearInterval(interval);
  }, [user, refreshSubscription]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setIsPremium(false);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, isPremium, isAdmin, signOut, refreshSubscription }}>
      {children}
    </AuthContext.Provider>
  );
};
