import * as React from "react";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { z } from "zod";
import { isTRPCClientError, trpc, trpcQueryUtils } from "@/router";
import { InfiniteScroll } from "@/features/shared/components/InfiniteScroll";
import { UserList } from "@/features/users/components/UserList";

export const Route = createFileRoute("/users/$userId/followers")({
  component: UserFollowersPage,
  params: {
    parse: (params) => ({
      userId: z.coerce.number().parse(params.userId),
    }),
  },

  loader: async ({ params, context: { trpcQueryUtils } }) => {
    try {
      await trpcQueryUtils.users.followers.prefetchInfinite({
        id: params.userId,
      });
    } catch (error) {
      if (isTRPCClientError(error) && error.data?.code === "NOT_FOUND")
        throw notFound();

      throw error;
    }
  },
});

function UserFollowersPage() {
  const { userId } = Route.useParams();

  const [{ pages }, followersQuery] =
    trpc.users.followers.useSuspenseInfiniteQuery(
      { id: userId },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  const totalFollowers = pages[0].followersCount;
  return (
    <main className="space-y-5">
      <h1 className="text-2xl font-semibold">Followers ({totalFollowers})</h1>
      <div>
        <InfiniteScroll
          onLoadMore={followersQuery.fetchNextPage}
          threshold={500}
        >
          <UserList
            users={pages.flatMap((page) => page.items)}
            isLoading={followersQuery.isPending}
            noUsersMessage="No followers for this user"
          />
        </InfiniteScroll>
      </div>
    </main>
  );
}
