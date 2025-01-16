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
            status: "created",
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
        onError: (err) => {
          toast.error("Something went wrong", {
            description: JSON.stringify(err),
          });
        },
      });
    },
    update: (props: {
      id: number;
      emdAmount: number;
      assetValue: number;
      auctionDate: Date;
    }) => {
      return useMutation({
        mutationFn: async () => {
          await supabase
            .from("auctions")
            .update({
              emd_amount: props.emdAmount,
              asset_value: props.assetValue,
              start_time: props.auctionDate,
              end_time: props.auctionDate,
            })
            .eq("id", props.id);
        },
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [QueryKeys.AUCTIONS, user?.org_id],
          });
          toast.info("Asset updated successfully", {
            description: "Ready to be approved",
          });
        },
        onError: (err) => {
          toast.error("Something went wrong", {
            description: JSON.stringify(err),
          });
        },
      });
    },
    list: () => {
      const getUnApprovedAuctions = async () => {
        const { data, error } = await supabase
          .from("auctions")
          .select(
            "id, title, description, status, images, case_number,  emd_amount, asset_value, start_time, end_time"
          )
          .eq("org_id", user?.org_id)
          .eq("status", "submitted");

        if (error) {
          throw new Error(error.message);
        }
        return data;
      };
      return useQuery({
        queryKey: [QueryKeys.AUCTIONS, user?.org_id, "submitted"],
        queryFn: getUnApprovedAuctions,
      });
    },
    pendingItems: () => {
      const getUnApprovedAuctions = async () => {
        const { data, error } = await supabase
          .from("auctions")
          .select(
            "id, title, description, status, images, case_number, emd_amount, asset_value, start_time, end_time"
          )
          .eq("org_id", user?.org_id)
          .eq("status", "created");

        if (error) {
          throw new Error(error.message);
        }
        return data;
      };
      return useQuery({
        queryKey: [QueryKeys.AUCTIONS, user?.org_id, "created"],
        queryFn: getUnApprovedAuctions,
      });
    },
    totalCounts: () => {
      const getCounts = async (filters: Record<string, any>) => {
        const { count, error } = await supabase
          .from("auctions")
          .select("*", { count: "exact", head: true })
          .eq("org_id", user?.org_id)
          .match(filters);
        if (error) {
          throw new Error(error.message);
        }
        return count;
      };

      const queries = [
        { key: "total", filters: {} },
        { key: "pending", filters: { status: "created" } },
        { key: "vehicle", filters: { category: "vehicle" } },
        { key: "land", filters: { category: "land" } },
        { key: "realEstate", filters: { category: "real-estate" } },
        { key: "gold", filters: { category: "gold" } },
      ];

      const counts = queries
        .map(({ key, filters }) =>
          useQuery({
            queryKey: [QueryKeys.AUCTIONS, user?.org_id, "count", key],
            queryFn: () => getCounts(filters),
          })
        )
        .map((query) => query.data);

      const result = {
        total: counts[0],
        pending: counts[1],
        vehicle: counts[2],
        land: counts[3],
        realEstate: counts[4],
        gold: counts[5],
      };

      return result;
    },
    readyForUpdate: async (id: string) => {
      await supabase
        .from("auctions")
        .update({
          status: "created",
        })
        .eq("org_id", user?.org_id)
        .eq("id", id);
    },

    readyForListing: async (id: string) => {
      await supabase
        .from("auctions")
        .update({
          status: "submitted",
        })
        .eq("org_id", user?.org_id)
        .eq("id", id);
    },

    readyForPublish: async (id: string) => {
      await supabase
        .from("auctions")
        .update({
          status: "active",
        })
        .eq("org_id", user?.org_id)
        .eq("id", id);
    },

    delete: async (id: string) => {
      supabase
        .from("auctions")
        .delete()
        .eq("org_id", user?.org_id)
        .eq("id", id);
    },
  };

  return {
    userApi,
    auctionsApi,
  };
};
