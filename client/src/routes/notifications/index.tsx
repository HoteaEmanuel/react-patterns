import * as React from "react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { trpc } from "@/router";
import { InfiniteScroll } from "@/features/shared/components/InfiniteScroll";
import NotificationList from "@/features/notifications/components/NotificationList";

export const Route = createFileRoute("/notifications/")({
  component: Notifications,
  loader: async ({ context: { trpcQueryUtils } }) => {
    const { currentUser } = await trpcQueryUtils.auth.currentUser.ensureData();

    if (!currentUser) {
      return redirect({ to: "/login" });
    }

    await trpcQueryUtils.notifications.feed.prefetchInfinite({});
  },
});

function Notifications() {
  const [{ pages }, notificationQuery] =
    trpc.notifications.feed.useSuspenseInfiniteQuery(
      {},
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  return (
    <main>
      <InfiniteScroll onLoadMore={notificationQuery.fetchNextPage}>
        <NotificationList
          notifications={pages.flatMap((page) => page.notifications)}
          isLoading={notificationQuery.isPending}
        />
      </InfiniteScroll>
    </main>
  );
}
