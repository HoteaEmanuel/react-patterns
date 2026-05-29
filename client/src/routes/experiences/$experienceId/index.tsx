import CommentsSection from "@/features/comments/components/CommentsSection";
import ExperienceDetails from "@/features/experiences/components/ExperienceDetails";
import NotFoundComponent from "@/features/shared/components/NotFoundComponent";
import { isTRPCClientError, trpc } from "@/router";
import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { contextProps } from "@trpc/react-query/shared";
import { z } from "zod";

export const Route = createFileRoute("/experiences/$experienceId/")({
  params: {
    parse: (params) => ({
      experienceId: z.coerce.number().parse(params.experienceId), // parses the params
    }),
  },
  loader: async ({ params, context: { trpcQueryUtils } }) => {
    try {
      await trpcQueryUtils.experiences.byId.ensureData({
        id: params.experienceId,
      });
    } catch (error) {
      if (isTRPCClientError(error) && error.data?.code === "NOT_FOUND") {
        throw notFound();
      }
      throw error;
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { experienceId } = Route.useParams();
  const [experience] = trpc.experiences.byId.useSuspenseQuery({
    id: experienceId,
  });
  return (
    <main className="space-y-4 pb-20">
      <ExperienceDetails experience={experience} />
      <CommentsSection
        experienceId={experienceId}
        commentsCount={experience.commentsCount}
      />
    </main>
  );
}
