import { trpc } from "@/router";

export function useCurrentUser() {
  const currentUser = trpc.auth.currentUser.useQuery();

  return {
    accesToken: currentUser.data?.accessToken,
    currentUser: currentUser.data?.currentUser,
  };
}
