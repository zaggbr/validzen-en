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
  userUsage: { postsRead: number; quizzesDone: number };
  incrementPostView: (slug: string) => Promise<boolean>;
  incrementQuizCompletion: (slug: string) => Promise<boolean>;
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
  userUsage: { postsRead: 0, quizzesDone: 0 },
  incrementPostView: async () => false,
  incrementQuizCompletion: async () => false,
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
  const [userUsage, setUserUsage] = useState({ postsRead: 0, quizzesDone: 0 });

  const migrated = useRef(false);

  const ADMIN_EMAILS = ["continentemedia@gmail.com", "zagg@uol.com.br"];

  const fetchProfile = useCallback(async (userId: string, email?: string) => {
    // eslint-disable-next-line prefer-const
    let { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    const isUserAdmin = email ? ADMIN_EMAILS.includes(email) : false;

    if (!data && !error) {
      // Auto-create profile if somehow missing
      const { data: newProfile, error: createError } = await supabase
        .from("user_profiles")
        .upsert({ 
          id: userId, 
          display_name: email?.split("@")[0] || "User",
          posts_viewed_count: 0,
          quizzes_completed_count: 0,
          is_premium: isUserAdmin // Garante acesso db-level para admins recém-criados
        })
        .select()
        .single();
      
      if (!createError) data = newProfile;
    } else if (data && isUserAdmin && data.is_premium !== true) {
      // Força a atualização no banco de dados para administradores que não têm a flag premium,
      // para garantir que passem pelas regras de RLS (Database Level).
      const { data: updatedProfile } = await supabase
        .from("user_profiles")
        .update({ is_premium: true })
        .eq("id", userId)
        .select()
        .single();
      
      if (updatedProfile) data = updatedProfile;
    }

    setIsAdmin(isUserAdmin);

    if (data) {
      setProfile(data as UserProfile);
      // Effectively premium if DB says so OR if user is admin
      setIsPremium(data.is_premium === true || isUserAdmin);
      setUserUsage({
        postsRead: (data as any).posts_viewed_count || 0,
        quizzesDone: (data as any).quizzes_completed_count || 0
      });
    } else {
      // No profile found yet, but still check if admin
      setIsPremium(isUserAdmin);
    }
  }, []);

  const refreshSubscription = useCallback(async (userId?: string, email?: string) => {
    try {
      await supabase.functions.invoke("check-subscription");
      if (userId) await fetchProfile(userId, email);
    } catch {
      // silently fail
    }
  }, [fetchProfile]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        setLoading(false);

        if (currentUser) {
          const isUserAdmin = ADMIN_EMAILS.includes(currentUser.email ?? "");
          setIsAdmin(isUserAdmin);
          
          // Initial fetch
          fetchProfile(currentUser.id, currentUser.email);

          if (!migrated.current) {
            migrated.current = true;
            migrateAnonymousResults(currentUser.id);
          }

          // Trigger background sync
          refreshSubscription(currentUser.id, currentUser.email);
        } else {
          setProfile(null);
          setIsPremium(false);
          setIsAdmin(false);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        setIsAdmin(ADMIN_EMAILS.includes(currentUser.email ?? ""));
        fetchProfile(currentUser.id, currentUser.email);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [refreshSubscription, fetchProfile]);

  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => refreshSubscription(user.id, user.email), 60_000);
    return () => clearInterval(interval);
  }, [user, refreshSubscription]);

  // Guest usage tracking
  useEffect(() => {
    if (!user) {
      const posts = JSON.parse(localStorage.getItem("validzen_guest_posts_read") || "[]");
      const quizzes = JSON.parse(localStorage.getItem("validzen_guest_quizzes_done") || "[]");
      setUserUsage({
        postsRead: posts.length,
        quizzesDone: quizzes.length
      });
    }
  }, [user]);

  const incrementPostView = async (slug: string): Promise<boolean> => {
    if (isPremium) return true;

    if (!user) {
      const posts = JSON.parse(localStorage.getItem("validzen_guest_posts_read") || "[]") as string[];
      if (posts.includes(slug)) return true;
      if (posts.length >= 3) return false;
      
      const newPosts = [...posts, slug];
      localStorage.setItem("validzen_guest_posts_read", JSON.stringify(newPosts));
      setUserUsage(prev => ({ ...prev, postsRead: newPosts.length }));
      return true;
    } else {
      // Logged in free user logic
      const { data: profile } = await supabase.from("user_profiles").select("posts_viewed_count").eq("id", user.id).single();
      const currentCount = (profile as any)?.posts_viewed_count || 0;
      
      if (currentCount >= 5) return false;

      const { error } = await supabase
        .from("user_profiles")
        .update({ posts_viewed_count: currentCount + 1 })
        .eq("id", user.id);
      
      if (!error) {
        setUserUsage(prev => ({ ...prev, postsRead: currentCount + 1 }));
        return true;
      }
      return false;
    }
  };

  const incrementQuizCompletion = async (slug: string): Promise<boolean> => {
    if (isPremium) return true;

    if (!user) {
      // Guests cannot do quizzes according to rules
      return false;
    } else {
      const { data: profile } = await supabase.from("user_profiles").select("quizzes_completed_count").eq("id", user.id).single();
      const currentCount = (profile as any)?.quizzes_completed_count || 0;
      
      if (currentCount >= 3) return false;

      const { error } = await supabase
        .from("user_profiles")
        .update({ quizzes_completed_count: currentCount + 1 })
        .eq("id", user.id);
      
      if (!error) {
        setUserUsage(prev => ({ ...prev, quizzesDone: currentCount + 1 }));
        return true;
      }
      return false;
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setIsPremium(false);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ 
      user, session, profile, loading, isPremium, isAdmin, userUsage, 
      incrementPostView, incrementQuizCompletion, 
      signOut, refreshSubscription 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
