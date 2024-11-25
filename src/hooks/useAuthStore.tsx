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

  const { data: org } = await supabase
    .from("organizations")
    .select("logo_url, name, accent_color")
    .eq("id", data?.org_id)
    .single();

  const info: IUser = {
    email_address: data?.email_address ?? "",
    role: data?.role ?? "",
    org_id: data?.org_id ?? "",
    logo_url: org?.logo_url ?? "",
    accent_color: org?.accent_color ?? "black",
  };
  // document.documentElement.style.setProperty("--primary", "");

  return { data: info, error, session };
};

interface IUser {
  email_address: string;
  role: string;
  org_id: string;
  logo_url: string;
  accent_color: string;
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
