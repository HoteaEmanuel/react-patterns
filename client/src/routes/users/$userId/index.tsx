import { createFileRoute, notFound } from '@tanstack/react-router'
import { z } from 'zod'
import { isTRPCClientError, trpc } from '@/router'
import UserAvatar from '@/features/users/components/UserAvatar'
import ExperienceList from '@/features/experiences/components/ExperienceList'
import { InfiniteScroll } from '@/features/shared/components/InfiniteScroll'
import Card from '@/features/shared/components/ui/Card'
import ErrorComponent from '@/features/shared/components/ErrorComponent'
import {
  UserForDetails,
  UserWithContext,
} from '@/features/users/components/types'
import { MartiniIcon } from 'lucide-react'
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser'
import EditProfileDialog from '@/features/users/components/EditProfileDialog'
import Link from '@/features/shared/components/ui/Link'
import UserFollowButton from '@/features/users/components/UserFollowButton'

export const Route = createFileRoute('/users/$userId/')({
  component: UserPage,
  params: {
    parse: (params) => ({
      userId: z.coerce.number().parse(params.userId),
    }),
  },

  loader: async ({ params, context: { trpcQueryUtils } }) => {
    try {
      await trpcQueryUtils.users.byId.ensureData({ id: params.userId })
    } catch (error) {
      if (isTRPCClientError(error) && error.data?.code === 'NOT_FOUND')
        throw notFound()

      throw error
    }
  },
})

function UserPage() {
  const params = Route.useParams()
  const [user] = trpc.users.byId.useSuspenseQuery({
    id: params.userId,
  })

  const experiencesQuery = trpc.experiences.byUserId.useInfiniteQuery(
    {
      id: user.id,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  )

  if (experiencesQuery.error) return <ErrorComponent />
  return (
    <main className="space-y-4">
      <Card className="space-y-4 flex items-center justify-start flex-col">
        <div className="flex flex-col items-center justify-center gap-2">
          <UserAvatar user={user} className="size-12" showName={false} />

          <h1 className="text-4xl font-bold">{user.name}</h1>
          {user.bio && (
            <p className="text-neutral-600 dark:text-neutral-400">{user.bio}</p>
          )}
        </div>

        <UserProfileStats user={user} />
        <UserProfileButton user={user} />
      </Card>

      <UserProfileHostStats user={user} />
      <h2 className="text-xl font-semibold">Experiences</h2>
      <InfiniteScroll
        onLoadMore={experiencesQuery.fetchNextPage}
        threshold={500}
      >
        <ExperienceList
          experiences={
            experiencesQuery.data?.pages.flatMap((page) => page.experiences) ??
            []
          }
          isLoading={
            experiencesQuery.isLoading || experiencesQuery.isFetchingNextPage
          }
          noExperiencesMessage="No experiences yet"
        />
      </InfiniteScroll>
      {/* </Card> */}
    </main>
  )
}

type UserProfileHostStatsProps = {
  user: UserForDetails
}

const UserProfileHostStats = ({ user }: UserProfileHostStatsProps) => {
  return (
    <Card>
      <h3 className="text-2xl font-semibold">Host Stats</h3>
      <div className="flex items-center justify-center gap-2 text-neutral-600 dark:text-neutral-400">
        <MartiniIcon className="size-5" />
        {user.hostedExperiencesCount}
      </div>
    </Card>
  )
}

type UserProfileStatsProps = {
  user: UserForDetails
}
const UserProfileStats = ({ user }: UserProfileStatsProps) => {
  const stats = [
    {
      label: 'Followers',
      value: user.followersCount,
      to: `/users/${user.id}/followers`,
      params: { userId: user.id },
    },
    {
      label: 'Following',
      value: user.followingCount,
      to: `/users/${user.id}/following`,
      params: { userId: user.id },
    },
  ]
  return (
    <div className="flex w-full items-center justify-center gap-8 border-y-2 border-neutral-200 py-4 dark:border-neutral-800">
      {stats.map((stat) => (
        <Link
          to={stat.to}
          params={stat.params}
          key={stat.label}
          variant="ghost"
          className="text-center"
        >
          <span className="font-medium">{stat.label}</span>
          <span className="text-2xl font-bold">{stat.value}</span>
        </Link>
      ))}
    </div>
  )
}

type UserProfileButtonsProps = {
  user: UserWithContext
}

const UserProfileButton = ({ user }: UserProfileButtonsProps) => {
  const { currentUser } = useCurrentUser()
  const isCurrentUser = currentUser?.id === user.id

  return isCurrentUser ? (
    <EditProfileDialog user={user} />
  ) : (
    <UserFollowButton targetUserId={user.id} isFollowing={user.isFollowing} />
  )
}
