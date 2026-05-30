import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { Button } from "@/features/shared/components/ui/Button";
import { useToast } from "@/features/shared/hooks/useToast";
import { trpc } from "@/router";
import { User } from "@advanced-react/server/database/schema";
import { redirect, useParams } from "@tanstack/react-router";

type UserFollowButtonProps = {
  targetUserId: User["id"];
  isFollowing: boolean;
};

const UserFollowButton = ({
  targetUserId,
  isFollowing,
}: UserFollowButtonProps) => {
  const utils = trpc.useUtils();
  const { toast } = useToast();
  const { userId: pathUserId } = useParams({ strict: false });
  const { currentUser } = useCurrentUser();
  const { experienceId: pathExperienceId } = useParams({ strict: false });

  const followMutation = trpc.users.follow.useMutation({
    onMutate: async ({ id }) => {
      if (!currentUser) {
        toast({
          title: "Error",
          description: "You must be logged in to follow users.",
          variant: "destructive",
        });
        return;
      }

      function updateUser<
        T extends { isFollowing: boolean; followersCount: number },
      >(oldData: T | undefined) {
        if (!oldData) return oldData;
        return {
          ...oldData,
          isFollowing: true,
          followersCount: oldData.followersCount + 1,
        };
      }

      await Promise.all([
        utils.users.byId.cancel({ id: id }),
        ...(pathUserId
          ? [
              utils.users.followers.cancel({ id }),
              utils.users.following.cancel({ id }),
            ]
          : []),
        ...(pathExperienceId
          ? [
              utils.users.experienceAttendees.cancel({
                experienceId: pathExperienceId,
              }),
            ]
          : []),
      ]);
      const previousData = {
        byId: utils.users.byId.getData({ id: id }),
        ...(pathUserId
          ? {
              followers: utils.users.followers.getInfiniteData({
                id: pathUserId,
              }),
              following: utils.users.following.getInfiniteData({
                id: pathUserId,
              }),
            }
          : {}),
        ...(pathExperienceId
          ? {
              experienceAttendees:
                utils.users.experienceAttendees.getInfiniteData({
                  experienceId: pathExperienceId,
                }),
            }
          : {}),
      };
      utils.users.byId.setData({ id: id }, (oldData) => {
        if (!oldData) return oldData;
        return updateUser(oldData);
      });

      if (pathUserId) {
        console.log("We got pathuserId", pathUserId);
        console.log("We got targetUserId", targetUserId);
        utils.users.followers.setInfiniteData({ id: pathUserId }, (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              items: page.items.map((user) =>
                user.id === id ? updateUser(user) : user,
              ),
            })),
          };
        });

        utils.users.following.setInfiniteData({ id: pathUserId }, (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              items: page.items.map((user) =>
                user.id === id ? updateUser(user) : user,
              ),
            })),
          };
        });
      }

      if (pathExperienceId) {
        utils.users.experienceAttendees.setInfiniteData(
          { experienceId: pathExperienceId },
          (oldData) => {
            if (!oldData) return oldData;
            return {
              ...oldData,
              pages: oldData.pages.map((page) => ({
                ...page,
                attendees: page.attendees.map((user) => {
                  if (user.id === id) {
                    return updateUser(user);
                  }
                  return user;
                }),
              })),
            };
          },
        );
      }

      return { previousData };
    },

    onError: (err, variables, context) => {
      utils.users.byId.setData(
        { id: variables.id },
        context?.previousData?.byId,
      );

      if (pathUserId) {
        utils.users.followers.setInfiniteData(
          { id: pathUserId },
          context?.previousData?.followers,
        );
        utils.users.following.setInfiniteData(
          { id: pathUserId },
          context?.previousData?.following,
        );
      }
      if (pathExperienceId) {
        utils.users.experienceAttendees.setInfiniteData(
          { experienceId: pathExperienceId },
          context?.previousData?.experienceAttendees,
        );
      }

      toast({
        title: "Error",
        description: "Failed to follow user.",
        variant: "destructive",
      });
    },
  });

  const unfollowMutation = trpc.users.unfollow.useMutation({
    onMutate: async ({ id }) => {
      if (!currentUser) {
        toast({
          title: "Error",
          description: "You must be logged in to unfollow users.",
          variant: "destructive",
        });
        return;
      }

      function updateUser<
        T extends { isFollowing: boolean; followersCount: number },
      >(oldData: T | undefined) {
        if (!oldData) return oldData;
        return {
          ...oldData,
          isFollowing: false,
          followersCount: oldData.followersCount - 1,
        };
      }
      await Promise.all([
        utils.users.byId.cancel({ id: id }),
        ...(pathUserId
          ? [
              utils.users.followers.cancel({ id }),
              utils.users.following.cancel({ id }),
            ]
          : []),
        ...(pathExperienceId
          ? [
              utils.users.experienceAttendees.cancel({
                experienceId: pathExperienceId,
              }),
            ]
          : []),
      ]);
      const previousData = {
        byId: utils.users.byId.getData({ id: id }),
        ...(pathUserId
          ? {
              followers: utils.users.followers.getInfiniteData({
                id: pathUserId,
              }),
              following: utils.users.following.getInfiniteData({
                id: pathUserId,
              }),
            }
          : {}),
        ...(pathExperienceId
          ? {
              experienceAttendees:
                utils.users.experienceAttendees.getInfiniteData({
                  experienceId: pathExperienceId,
                }),
            }
          : {}),
      };
      utils.users.byId.setData({ id: id }, (oldData) => {
        if (!oldData) return oldData;
        return updateUser(oldData);
      });

      if (pathUserId) {
        console.log("We got pathuserId", pathUserId);
        console.log("We got targetUserId", targetUserId);
        utils.users.followers.setInfiniteData({ id: pathUserId }, (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              items: page.items.map((user) =>
                user.id === id ? updateUser(user) : user,
              ),
            })),
          };
        });

        utils.users.following.setInfiniteData({ id: pathUserId }, (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              items: page.items.map((user) =>
                user.id === id ? updateUser(user) : user,
              ),
            })),
          };
        });
      }

      if (pathExperienceId) {
        utils.users.experienceAttendees.setInfiniteData(
          { experienceId: pathExperienceId },
          (oldData) => {
            if (!oldData) return oldData;
            return {
              ...oldData,
              pages: oldData.pages.map((page) => ({
                ...page,
                attendees: page.attendees.map((user) => {
                  if (user.id === id) {
                    return updateUser(user);
                  }
                  return user;
                }),
              })),
            };
          },
        );
      }
      return { previousData };
    },
    onError: (err, variables, context) => {
      utils.users.byId.setData({ id: variables.id }, context?.previousData);
      toast({
        title: "Error",
        description: "Failed to update follow status.",
        variant: "destructive",
      });
    },
  });


  if(!currentUser || currentUser.id === targetUserId) {
    return null;
  } 
  return (
    <Button
      variant={isFollowing ? "outline" : "default"}
      onClick={(e) => {
        e.preventDefault();
        if (isFollowing) {
          unfollowMutation.mutate({ id: targetUserId });
        } else {
          followMutation.mutate({ id: targetUserId });
        }
      }}
      disabled={followMutation.isPending || unfollowMutation.isPending}
    >
      {isFollowing ? "Unfollow" : "Follow"}
    </Button>
  );
};

export default UserFollowButton;
