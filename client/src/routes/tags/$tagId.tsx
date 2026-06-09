import * as React from "react";
import { createFileRoute, notFound, useParams } from "@tanstack/react-router";
import { z } from "zod";
import { isTRPCClientError, trpc, trpcQueryUtils } from "@/router";
import { InfiniteScroll } from "@/features/shared/components/InfiniteScroll";
import ExperienceList from "@/features/experiences/components/ExperienceList";

export const Route = createFileRoute("/tags/$tagId")({
  component: RouteComponent,
  params: {
    parse: (params) => ({
      tagId: z.coerce.number().parse(params.tagId),
    }),
  },
  loader: async ({ params, context: { trpcQueryUtils } }) => {
    try {
      await Promise.all([
        trpcQueryUtils.tags.byId.ensureData({ id: params.tagId }),
        trpcQueryUtils.experiences.byTagId.prefetchInfinite({
          id: params.tagId,
        }),
      ]);
    } catch (error) {
      if (isTRPCClientError(error) && error.data?.code === "NOT_FOUND")
        throw notFound();
    }
  },
});

function RouteComponent() {
  const { tagId } = Route.useParams();
  const [{ pages }, trpcQuery] =
    trpc.experiences.byTagId.useSuspenseInfiniteQuery(
      { id: tagId },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  const [tag] = trpc.tags.byId.useSuspenseQuery({ id: tagId });
  return (
    <main className="space-y-4">
      <h2 className="text-2xl font-semibold">
        Experiences with Tag:<span className="font-bold"> {tag.name}</span>
      </h2>
      <InfiniteScroll onLoadMore={trpcQuery.fetchNextPage}>
        <ExperienceList experiences={pages.flatMap((p) => p.experiences)} />
      </InfiniteScroll>
    </main>
  );
}
