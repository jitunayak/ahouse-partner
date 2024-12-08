import { IUserCreateInput } from "@/components/create-user-modal";
import { queryClient } from "@/lib";
import { supabase } from "@/supabaseClient";
import { QueryKeys } from "@/types/enum";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useShallow } from "zustand/react/shallow";
import { useStore } from "./useStore";

export const useApi = () => {
  const { session } = useStore(useShallow((s) => ({ session: s.session })));
  const { user } = useStore(useShallow((s) => ({ user: s.user })));

  const authAxios = axios.create({
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${session?.access_token}`,
    },
  });

  const userApi = {
    create: () =>
      useMutation({
        mutationFn: (input: IUserCreateInput) =>
          authAxios.post("/api/v1/create-account", {
            email: input.email,
            firstName: input.firstName,
            lastName: input.lastName,
            role: input.role,
          }),
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [QueryKeys.USERS],
          });
        },
      }),

    list: () =>
      useQuery({
        queryKey: [QueryKeys.USERS],
        queryFn: async () =>
          await supabase
            .from("profiles_with_org_and_creator")
            .select(
              `id, email_address, full_name, org_name, role, created_at, created_by`
            )
            .eq("org_id", user?.org_id)
            .order("id", { ascending: false }),
      }),
  };

  const auctionsApi = {
    list: () => {
      const getUnApprovedAuctions = async () => {
        const { data, error } = await supabase
          .from("auctions")
          .select("id, title, description, status, images, case_number")
          .eq("org_id", user?.org_id);
        if (error) {
          throw new Error(error.message);
        }
        return data;
      };
      return useQuery({
        queryKey: [QueryKeys.AUCTIONS, user?.org_id],
        queryFn: getUnApprovedAuctions,
      });
    },
  };

  return {
    userApi,
    auctionsApi,
  };
};
