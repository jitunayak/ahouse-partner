import { IUserCreateInput } from "@/components/create-user-modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useShallow } from "zustand/react/shallow";
import { useStore } from "./useStore";

export const useApi = () => {
  const { session } = useStore(useShallow((s) => ({ session: s.session })));
  const queryClient = useQueryClient();
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
            queryKey: ["profiles"],
          });
        },
      }),
  };

  return {
    userApi,
  };
};
