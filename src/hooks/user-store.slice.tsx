import { supabase } from "@/supabaseClient";
import { IUser } from "@/types";
import { AuthError, Session } from "@supabase/supabase-js";
import { StateCreator } from "zustand";
import { useSession } from "./useSession";

const { getUserSession } = useSession();

interface IAuthState {
  user: IUser | null;
  session: Session | null;
}

interface IAuthAction {
  login: () => Promise<{ error: AuthError; data: null; session: null } | void>;
  signout: () => Promise<void>;
  setSession: (session: Session | null) => void;
}

export interface IAuthStore extends IAuthState, IAuthAction {}

export const createAuthSlice: StateCreator<
  IAuthStore,
  [["zustand/immer", never]],
  [],
  IAuthStore
> = (set) => ({
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
  setSession: (session: Session | null) => {
    set({
      session,
    });
  },
});
