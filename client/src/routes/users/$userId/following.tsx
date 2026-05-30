import * as React from "react";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { z } from "zod";
import { isTRPCClientError, trpc, trpcQueryUtils } from "@/router";
import { InfiniteScroll } from "@/features/shared/components/InfiniteScroll";
import { UserList } from "@/features/users/components/UserList";

export const Route = createFileRoute("/users/$userId/following")({
  component: UserFollowingPage,
  params: {
    parse: (params) => ({
      userId: z.coerce.number().parse(params.userId),
    }),
  },

  loader: async ({ params, context: { trpcQueryUtils } }) => {
    try {
      await trpcQueryUtils.users.following.prefetchInfinite({
        id: params.userId,
      });
    } catch (error) {
      if (isTRPCClientError(error) && error.data?.code === "NOT_FOUND")
        throw notFound();

      throw error;
    }
  },
});

function UserFollowingPage() {
  const { userId } = Route.useParams();

  const [{ pages }, followingQuery] =
    trpc.users.following.useSuspenseInfiniteQuery(
      { id: userId },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  const totalFollowing = pages[0].followingCount;
  return (
    <main className="space-y-5">
      <h1 className="text-2xl font-semibold">Following ({totalFollowing})</h1>
      <div>
        <InfiniteScroll
          onLoadMore={followingQuery.fetchNextPage}
          threshold={500}
        >
          <UserList
            users={pages.flatMap((page) => page.items)}
            isLoading={followingQuery.isPending}
            noUsersMessage="No users following this user"
          />
        </InfiniteScroll>
      </div>
    </main>
  );
}
