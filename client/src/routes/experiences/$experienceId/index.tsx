import CommentsSection from '@/features/comments/components/CommentsSection'
import ExperienceDetails from '@/features/experiences/Components/ExperienceDetails'
import { trpc, trpcQueryUtils } from '@/router'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

export const Route = createFileRoute('/experiences/$experienceId/')({
  params: {
    parse: (params) => ({
      experienceId: z.coerce.number().parse(params.experienceId), // parses the params
    }),
  },
  loader: async ({ params, context: { trpcQueryUtils } }) => {
    await trpcQueryUtils.experiences.byId.ensureData({
      id: params.experienceId,
    })
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { experienceId } = Route.useParams()
  const [experience] = trpc.experiences.byId.useSuspenseQuery({
    id: experienceId,
  })
  return (
    <main className="space-y-4 pb-20">
      <ExperienceDetails experience={experience} />
      <CommentsSection
        experienceId={experienceId}
        commentsCount={experience.commentsCount}
      />
    </main>
  )
}
