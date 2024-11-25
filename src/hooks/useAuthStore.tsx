import { supabase } from "@/supabaseClient";
import { AuthError, Session } from "@supabase/supabase-js";
import { create } from "zustand";

const getUserSession = async () => {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  if (error) {
    return { error, data: null, session: null };
  }
  const { data } = await supabase
    .from("profiles")
    .select("email_address, role, org_id")
    .eq("id", session?.user?.id)
    .single();

  return { data, error, session };
};

interface IUser {
  email_address: string;
  role: string;
  org_id: string;
}
interface AuthState {
  user: IUser | null;
  session: Session | null;
  login: () => Promise<{ error: AuthError; data: null; session: null } | void>;
  signout: () => Promise<void>;
}
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  login: async () => {
    const { data, error, session } = await getUserSession();
    if (error) {
      return { error, data: null, session: null };
    }
    set({
      user: data,
      session,
    });
  },
  signout: async () => {
    await supabase.auth.signOut();
    set({
      user: null,
      session: null,
    });
  },
}));
