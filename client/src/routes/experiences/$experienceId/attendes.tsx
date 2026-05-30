import * as React from "react";
import { createFileRoute, notFound, useParams } from "@tanstack/react-router";
import { z } from "zod";
import { isTRPCClientError, trpc } from "@/router";
import { InfiniteScroll } from "@/features/shared/components/InfiniteScroll";
import { User } from "lucide-react";
import { UserList } from "@/features/users/components/UserList";

export const Route = createFileRoute("/experiences/$experienceId/attendes")({
  component: ExperienceAttendesPage,
  params: {
    parse: (params) => ({
      experienceId: z.coerce.number().parse(params.experienceId),
    }),
  },
  loader: async ({ params, context: { trpcQueryUtils } }) => {
    try {
      await Promise.all([
        trpcQueryUtils.experiences.byId.ensureData({
          id: params.experienceId,
        }),
        trpcQueryUtils.users.experienceAttendees.prefetchInfinite({
          experienceId: params.experienceId,
        }),
      ]);
    } catch (error) {
      if (isTRPCClientError(error) && error.data?.code === "NOT_FOUND") {
        throw notFound();
      }
      throw error;
    }
  },
});

function ExperienceAttendesPage() {
  const { experienceId } = Route.useParams();

  const [experience] = trpc.experiences.byId.useSuspenseQuery({
    id: experienceId,
  });

  const [{ pages }, attendesQuery] =
    trpc.users.experienceAttendees.useSuspenseInfiniteQuery(
      { experienceId },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  const totalAttendes = pages[0].attendeesCount;

  return (
    <main className="space-y-5">
      <h1 className="text-2xl font-semibold">
        Attendes for "<span className="font-bold">{experience.title}</span>"
      </h1>
      <div>
        <h2 className=" font-medium mb-5">Attendes ({totalAttendes})</h2>
        <InfiniteScroll
          onLoadMore={attendesQuery.fetchNextPage}
          threshold={500}
        >
          <UserList
            users={pages.flatMap((page) => page.attendees)}
            isLoading={attendesQuery.isPending}
            noUsersMessage="No attendes for this experience"
          />
        </InfiniteScroll>
      </div>
    </main>
  );
}
