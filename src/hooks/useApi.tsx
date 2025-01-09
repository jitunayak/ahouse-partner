import { IUserCreateInput } from "@/components/create-user-modal";
import { queryClient } from "@/lib";
import { supabase } from "@/supabaseClient";
import { QueryKeys } from "@/types/enum";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
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
            queryKey: [QueryKeys.USERS, user?.org_id],
          });
        },
      }),

    list: () =>
      useQuery({
        queryKey: [QueryKeys.USERS, user?.org_id],
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
    save: (props: {
      title: string;
      case_number: string;
      description: string;
      assetType: string;
      branch: string;
      images: string[];
    }) => {
      return useMutation({
        mutationFn: async () => {
          await supabase.from("auctions").insert({
            title: props.title,
            case_number: props.case_number,
            description: props.description,
            branch: props.branch,
            org_id: user?.org_id,
            status: "submitted",
            category: props.assetType,
            images: props.images,
            created_by: user?.id,
          });
        },
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [QueryKeys.AUCTIONS, user?.org_id],
          });
          toast.info("Asset saved successfully", {
            description:
              "It will be live once bidding information is submitted and approved",
          });
        },
      });
    },
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
    pendingItems: () => {
      const getUnApprovedAuctions = async () => {
        const { data, error } = await supabase
          .from("auctions")
          .select("id, title, description, status, images, case_number")
          .eq("org_id", user?.org_id)
          .eq("status", "submitted");

        if (error) {
          throw new Error(error.message);
        }
        return data;
      };
      return useQuery({
        queryKey: [QueryKeys.AUCTIONS, user?.org_id, "pending"],
        queryFn: getUnApprovedAuctions,
      });
    },

    totalAuctions: () => {
      const getUnApprovedAuctions = async () => {
        const { data, error } = await supabase
          .from("auctions")
          .select("*", { count: "exact" })
          .eq("org_id", user?.org_id);
        if (error) {
          throw new Error(error.message);
        }
        return data.length;
      };
      return useQuery({
        queryKey: [QueryKeys.AUCTIONS, user?.org_id, "total"],
        queryFn: getUnApprovedAuctions,
      });
    },

    totalPendingAssets: () => {
      const getUnApprovedAuctions = async () => {
        const { data, error } = await supabase
          .from("auctions")
          .select("*", { count: "exact" })
          .eq("org_id", user?.org_id)
          .eq("status", "submitted");
        if (error) {
          throw new Error(error.message);
        }
        return data.length;
      };
      return useQuery({
        queryKey: [QueryKeys.AUCTIONS, user?.org_id, "submitted"],
        queryFn: getUnApprovedAuctions,
      });
    },
    totalVehicles: () => {
      const getUnApprovedAuctions = async () => {
        const { data, error } = await supabase
          .from("auctions")
          .select("*", { count: "exact" })
          .eq("org_id", user?.org_id)
          .eq("category", "vehicle");
        if (error) {
          throw new Error(error.message);
        }
        return data.length;
      };
      return useQuery({
        queryKey: [QueryKeys.AUCTIONS, user?.org_id, "vehicle"],
        queryFn: getUnApprovedAuctions,
      });
    },
    totalLand: () => {
      const getUnApprovedAuctions = async () => {
        const { data, error } = await supabase
          .from("auctions")
          .select("*", { count: "exact" })
          .eq("org_id", user?.org_id)
          .eq("category", "land");
        if (error) {
          throw new Error(error.message);
        }
        return data.length;
      };
      return useQuery({
        queryKey: [QueryKeys.AUCTIONS, user?.org_id, "land"],
        queryFn: getUnApprovedAuctions,
      });
    },

    totalRealEstate: () => {
      const getUnApprovedAuctions = async () => {
        const { data, error } = await supabase
          .from("auctions")
          .select("*", { count: "exact" })
          .eq("org_id", user?.org_id)
          .eq("category", "real-estate");
        if (error) {
          throw new Error(error.message);
        }
        return data.length;
      };
      return useQuery({
        queryKey: [QueryKeys.AUCTIONS, user?.org_id, "real-estate"],
        queryFn: getUnApprovedAuctions,
      });
    },
    totalGold: () => {
      const getUnApprovedAuctions = async () => {
        const { data, error } = await supabase
          .from("auctions")
          .select("*", { count: "exact" })
          .eq("org_id", user?.org_id)
          .eq("category", "gold");
        if (error) {
          throw new Error(error.message);
        }
        return data.length;
      };
      return useQuery({
        queryKey: [QueryKeys.AUCTIONS, user?.org_id, "gold"],
        queryFn: getUnApprovedAuctions,
      });
    },
  };

  return {
    userApi,
    auctionsApi,
  };
};
