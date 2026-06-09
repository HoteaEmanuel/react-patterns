import { createFileRoute, notFound } from "@tanstack/react-router";
import { z } from "zod";
import { isTRPCClientError, trpc } from "@/router";
import { InfiniteScroll } from "@/features/shared/components/InfiniteScroll";
import { UserList } from "@/features/users/components/UserList";
import UserFollowButton from "@/features/users/components/UserFollowButton";
import ExperienceKickButton from "@/features/experiences/components/ExperienceKickButton";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";

export const Route = createFileRoute("/experiences/$experienceId/attendees")({
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

  const { currentUser } = useCurrentUser();
  const [{ pages }, attendesQuery] =
    trpc.users.experienceAttendees.useSuspenseInfiniteQuery(
      { experienceId },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  const totalAttendes = pages[0].attendeesCount;
  const isOwner = experience.userId === currentUser?.id;
  return (
    <main className="space-y-5">
      <h1 className="text-2xl font-semibold">
        Attendes for "<span className="font-bold">{experience.title}</span>"
      </h1>
      <div>
        <h2 className="mb-5 font-medium">Attendes ({totalAttendes})</h2>
        <InfiniteScroll
          onLoadMore={attendesQuery.fetchNextPage}
          threshold={500}
        >
          <UserList
            users={pages.flatMap((page) => page.attendees)}
            isLoading={attendesQuery.isPending}
            noUsersMessage="No attendes for this experience"
            rightComponent={(user) => (
              <div className="flex gap-4">
                <UserFollowButton
                  isFollowing={user.isFollowing}
                  targetUserId={user.id}
                />

                {isOwner && (
                  <ExperienceKickButton
                    experienceId={experience.id}
                    userId={user.id}
                  />
                )}
              </div>
            )}
          />
        </InfiniteScroll>
      </div>
    </main>
  );
}
