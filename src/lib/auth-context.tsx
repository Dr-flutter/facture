import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type AuthCtx = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (phone: string, fullName: string, password: string) => Promise<{ error?: string }>;
  signIn: (phone: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

// Convert phone to synthetic email (no SMS verification needed)
const phoneToEmail = (phone: string) => {
  const clean = phone.replace(/[^\d]/g, "");
  return `u${clean}@invoice.app`;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const safetyTimer = window.setTimeout(() => {
      if (!cancelled) setLoading(false);
    }, 1500);

    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      if (cancelled) return;
      setSession(s);
      setUser(s?.user ?? null);
      setLoading(false);
    });
    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (cancelled) return;
        setSession(data.session);
        setUser(data.session?.user ?? null);
      })
      .catch(() => {
        if (cancelled) return;
        setSession(null);
        setUser(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
      window.clearTimeout(safetyTimer);
      sub.subscription.unsubscribe();
    };
  }, []);

  const signUp: AuthCtx["signUp"] = async (phone, fullName, password) => {
    const email = phoneToEmail(phone);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, phone } },
    });
    if (error) return { error: error.message };

    if (data.session) {
      setSession(data.session);
      setUser(data.user ?? data.session.user);
      setLoading(false);
      return {};
    }

    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (loginError) return { error: "Compte créé. Connectez-vous maintenant." };
    setSession(loginData.session);
    setUser(loginData.user);
    setLoading(false);
    return {};
  };

  const signIn: AuthCtx["signIn"] = async (phone, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: phoneToEmail(phone),
      password,
    });
    if (error) return { error: "Téléphone ou mot de passe incorrect" };
    setSession(data.session);
    setUser(data.user);
    setLoading(false);
    return {};
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <Ctx.Provider value={{ user, session, loading, signUp, signIn, signOut }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be used within AuthProvider");
  return c;
};
