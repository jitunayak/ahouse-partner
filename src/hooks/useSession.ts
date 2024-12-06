import { supabase } from "@/supabaseClient";
import { IUser } from "@/types";

export const useSession = () => {
  return {
    getUserSession: async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) {
        return { error, data: null, session: null };
      }
      const { data } = await supabase
        .from("profiles")
        .select("email_address, role, org_id, id, first_name, last_name")
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
        first_name: data?.first_name ?? "",
        last_name: data?.last_name ?? "",
        id: data?.id ?? "",
      };
      // document.documentElement.style.setProperty("--primary", "");

      return { data: info, error, session };
    },
  };
};
