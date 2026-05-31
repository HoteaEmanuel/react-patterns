import * as React from "react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { trpc } from "@/router";
import { transformTRPCResponse } from "@trpc/server";
import { InfiniteScroll } from "@/features/shared/components/InfiniteScroll";
import ExperienceList from "@/features/experiences/components/ExperienceList";

export const Route = createFileRoute("/favorites/")({
  component: FavoritesPage,
  loader: async ({ context: { trpcQueryUtils } }) => {
    const { currentUser } = await trpcQueryUtils.auth.currentUser.ensureData();
    if (!currentUser) {
      return redirect({ to:'/login'});
    }

    await trpcQueryUtils.experiences.favorites.prefetchInfinite({});
  },
});

function FavoritesPage() {

    const [{pages},favoritesQuery]=trpc.experiences.favorites.useSuspenseInfiniteQuery({},{
        getNextPageParam:(lastPage)=>lastPage.nextCursor
    });


  return <main>
    <InfiniteScroll onLoadMore={favoritesQuery.fetchNextPage}>
    <ExperienceList experiences={pages.flatMap(page=>page.experiences)}/>
    </InfiniteScroll>
  </main>
}
