import { IUser } from "@/types";
import { redirect } from "@tanstack/react-router";

export const roleChecker = (user: IUser, role: string) => {
  if (user.role !== role) {
    redirect({ to: "/403", replace: true });
  }
};
