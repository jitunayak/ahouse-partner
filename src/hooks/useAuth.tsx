import { supabase } from "@/supabaseClient";
import { Session } from "@supabase/supabase-js";
import { useRouter } from "@tanstack/react-router";
import { createContext, useContext, useEffect, useState } from "react";

const initialState: {
  user: any | null;
  session: Session | null;
  isLoading: boolean;
} = {
  user: null,
  session: null,
  isLoading: false,
};
const AuthContext = createContext(initialState);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState(initialState);
  const router = useRouter();
  useEffect(() => {
    setState((prev) => ({ ...prev, isLoading: true }));
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log({ session, error });
      if (error || !session) {
        setState({ session, user: null, isLoading: false });
        router.navigate({ to: "/login", replace: true });
        return;
      }
      supabase
        .from("profiles")
        .select("email_address, role, org_id")
        .eq("id", session?.user?.id)
        .single()
        .then(({ data }) => {
          if (data) {
            setState({ session, user: data, isLoading: false });
            // router.navigate({ to: "/home", replace: true });
          }
        });
    });
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw Error("useAuth must be used within AuthProvider");
  return context;
}
