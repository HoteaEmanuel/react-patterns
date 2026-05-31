import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { useToast } from "@/features/shared/hooks/useToast";
import { trpc } from "@/router";
import { Experience, User } from "@advanced-react/server/database/schema";
import { useParams, useSearch } from "@tanstack/react-router";

type ExperienceOptionsProps = {
  edit?: {
    onSuccess?: (id: Experience["id"]) => void;
  };
  remove?: {
    onSuccess?: (id: Experience["id"]) => void;
  };
  attend?: {
    onSuccess?: (experienceId: Experience["id"], isAttending: boolean) => void;
  };
};

export function useExperienceMutation({
  edit,
  remove,
  attend,
}: ExperienceOptionsProps) {
  const { toast } = useToast();
  const utils = trpc.useUtils();
  const { currentUser } = useCurrentUser();
  const { q: pathQ } = useSearch({ strict: false });

  const { userId: pathUserId } = useParams({ strict: false });
  const editMutation = trpc.experiences.edit.useMutation({
    onError: (err) => {
      toast({
        title: "Failed to edit experience",
        description: err.message,
        variant: "destructive",
      });
    },
    onSuccess: async ({ id }) => {
      await utils.experiences.byId.invalidate({ id }); // Invalidate so that the user can see the fresh data for the experience details
      toast({
        title: "Experience updated succesfully!",
        variant: "success",
      });

      edit?.onSuccess?.(id);
    },
  });

  const deleteMutation = trpc.experiences.delete.useMutation({
    onError: (err) => {
      toast({
        title: "Failed to delete experience",
        description: err.message,
        variant: "destructive",
      });
    },
    onSuccess: async (id) => {
      // Invalidate the feed because theres where the user is sent, the search and user profile are invalidated conditionally
      await Promise.all([
        utils.experiences.feed.invalidate(),
        utils.experiences.favorites.invalidate(),
        ...(pathUserId
          ? [utils.experiences.byUserId.invalidate({ id: pathUserId })]
          : []),
        ...(pathQ ? [utils.experiences.search.invalidate()] : []),
      ]); // Invalidate so that the user can see the fresh data for the experience details
      toast({
        title: "Experience deleted succesfully!",
        variant: "success",
      });

      remove?.onSuccess?.(id);
    },
  });

  const attendMutation = trpc.experiences.attend.useMutation({
    onMutate: async ({ id }) => {
      // Generic function for updating the isAttenting state of the experience
      function updateExperience<
        T extends {
          isAttending: boolean;
          attendeesCount: number;
          attendees?: User[];
        },
      >(oldData: T): T {
        return {
          ...oldData,
          isAttending: true,
          attendeesCount: oldData.attendeesCount + 1,
          ...(oldData.attendees
            ? {
                attendees: [currentUser, ...oldData.attendees],
              }
            : {}),
        };
      }
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await Promise.all([
        utils.experiences.byId.cancel({ id }),
        utils.experiences.feed.cancel(),
        utils.experiences.favorites.cancel(),
        ...(pathUserId
          ? [utils.experiences.byUserId.cancel({ id: pathUserId })]
          : []),
        ...(pathQ ? [utils.experiences.search.cancel()] : []),
      ]);
      // Snapshot of the previous value
      const previousData = {
        byId: utils.experiences.byId.getData({ id }),
        feed: utils.experiences.feed.getInfiniteData(),
        favorites: utils.experiences.favorites.getInfiniteData(),
        byUserId: pathUserId
          ? utils.experiences.byUserId.getData({ id: pathUserId })
          : undefined,
        search: pathQ
          ? utils.experiences.search.getInfiniteData({ q: pathQ })
          : undefined,
        attendes: utils.users.experienceAttendees.getInfiniteData({
          experienceId: id,
        }),
      };

      utils.experiences.byId.setData({ id }, (old) => {
        if (!old) return old;
        return updateExperience(old);
      });

      // Updating the cache, setting isAttenting to true for the experience with matching id from the feeds

      utils.experiences.favorites.setInfiniteData({}, (oldData) => {
        if (!oldData) return;
        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            experiences: page.experiences.map((e) =>
              e.id === id ? updateExperience(e) : e,
            ), // eliminate the experience from the favorites page optimisticly
          })),
        };
      });

      utils.experiences.feed.setInfiniteData({}, (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((p) => ({
            ...p,
            experiences: p.experiences.map((e) =>
              e.id === id ? updateExperience(e) : e,
            ),
          })),
        };
      });
      if (pathUserId) {
        utils.experiences.byUserId.setInfiniteData(
          { id: pathUserId },
          (old) => {
            if (!old) return old;
            return {
              ...old,
              pages: old.pages.map((p) => ({
                ...p,
                experiences: p.experiences.map((e) =>
                  e.id === id ? updateExperience(e) : e,
                ),
              })),
            };
          },
        );
      }

      if (pathQ) {
        utils.experiences.search.setInfiniteData({ q: pathQ }, (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((p) => ({
              ...p,
              experiences: p.experiences.map((e) =>
                e.id === id ? updateExperience(e) : e,
              ),
            })),
          };
        });
      }

      // returning the previous data so that we can rollback if an error occurs
      return { previousData };
    },
    onError: (err, variables, context) => {
      toast({
        title: "Failed to attend experience",
        description: err.message,
        variant: "destructive",
      });
      // Rollback to the previous value
      utils.experiences.byId.setData(
        { id: variables.id },
        context?.previousData.byId,
      );
      utils.experiences.feed.setInfiniteData({}, context?.previousData.feed);
      if (pathQ) {
        utils.experiences.search.setInfiniteData(
          { q: pathQ },
          context?.previousData.search,
        );
      }
      if (pathUserId) {
        utils.experiences.byUserId.setInfiniteData(
          { id: pathUserId },
          context?.previousData.byUserId,
        );
      }
    },
  });

  const unattendMutation = trpc.experiences.unattend.useMutation({
    onMutate: async ({ id }) => {
      // Generic function for updating the isAttenting state of the experience
      function updateExperience<
        T extends {
          isAttending: boolean;
          attendeesCount: number;
          attendees?: User[];
        },
      >(oldData: T): T {
        return {
          ...oldData,
          isAttending: false,
          attendeesCount: Math.max(0, oldData?.attendeesCount - 1),
          ...(oldData.attendees
            ? {
                attendees: oldData.attendees.filter(
                  (a) => a.id !== currentUser?.id,
                ),
              }
            : {}),
        };
      }
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await Promise.all([
        utils.experiences.byId.cancel({ id }),
        utils.experiences.feed.cancel(),
        utils.experiences.favorites.cancel(),
        ...(pathUserId
          ? [utils.experiences.byUserId.cancel({ id: pathUserId })]
          : []),
        ...(pathQ ? [utils.experiences.search.cancel()] : []),
      ]);
      // Snapshot of the previous value
      const previousData = {
        byId: utils.experiences.byId.getData({ id }),
        feed: utils.experiences.feed.getInfiniteData(),
        favorites: utils.experiences.favorites.getInfiniteData(),
        byUserId: pathUserId
          ? utils.experiences.byUserId.getData({ id: pathUserId })
          : undefined,
        search: pathQ
          ? utils.experiences.search.getInfiniteData({ q: pathQ })
          : undefined,
      };

      // Updating the cache, setting isAttenting to true for the experience with matching id from the feeds

      utils.experiences.byId.setData({ id }, (old) => {
        if (!old) return old;
        return updateExperience(old);
      });

      utils.experiences.favorites.setInfiniteData({}, (oldData) => {
        if (!oldData) return;
        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            experiences: page.experiences.map((e) =>
              e.id === id ? updateExperience(e) : e,
            ), // eliminate the experience from the favorites page optimisticly
          })),
        };
      });

      utils.experiences.feed.setInfiniteData({}, (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((p) => ({
            ...p,
            experiences: p.experiences.map((e) =>
              e.id === id ? updateExperience(e) : e,
            ),
          })),
        };
      });
      if (pathUserId) {
        utils.experiences.byUserId.setInfiniteData(
          { id: pathUserId },
          (old) => {
            if (!old) return old;
            return {
              ...old,
              pages: old.pages.map((p) => ({
                ...p,
                experiences: p.experiences.map((e) =>
                  e.id === id ? updateExperience(e) : e,
                ),
              })),
            };
          },
        );
      }

      if (pathQ) {
        utils.experiences.search.setInfiniteData({ q: pathQ }, (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((p) => ({
              ...p,
              experiences: p.experiences.map((e) =>
                e.id === id ? updateExperience(e) : e,
              ),
            })),
          };
        });
      }

      utils.experiences.search.setInfiniteData;
      // returning the previous data so that we can rollback if an error occurs
      return { previousData };
    },
    onError: (err, variables, context) => {
      toast({
        title: "Failed to cancel attendance",
        description: err.message,
        variant: "destructive",
      });
      // Rollback to the previous value
      utils.experiences.byId.setData(
        { id: variables.id },
        context?.previousData.byId,
      );
      utils.experiences.feed.setInfiniteData({}, context?.previousData.feed);
      if (pathQ) {
        utils.experiences.search.setInfiniteData(
          { q: pathQ },
          context?.previousData.search,
        );
      }
      if (pathUserId) {
        utils.experiences.byUserId.setInfiniteData(
          { id: pathUserId },
          context?.previousData.byUserId,
        );
      }
    },
  });

  const favoriteMutation = trpc.experiences.favorite.useMutation({
    onMutate: async ({ id }) => {
      function updateExperience<
        T extends {
          isFavorited: boolean;
          favoritesCount: number;
        },
      >(oldData: T): T {
        return {
          ...oldData,
          isFavorited: true,
          favoritesCount: oldData.favoritesCount + 1,
        };
      }

      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await Promise.all([
        utils.experiences.byId.cancel({ id }),
        utils.experiences.feed.cancel(),
        ...(pathUserId
          ? [utils.experiences.byUserId.cancel({ id: pathUserId })]
          : []),
        ...(pathQ ? [utils.experiences.search.cancel()] : []),
      ]);
      // Snapshot of the previous value
      const previousData = {
        byId: utils.experiences.byId.getData({ id }),
        feed: utils.experiences.feed.getInfiniteData(),
        byUserId: pathUserId
          ? utils.experiences.byUserId.getData({ id: pathUserId })
          : undefined,
        search: pathQ
          ? utils.experiences.search.getInfiniteData({ q: pathQ })
          : undefined,
      };

      // Updating the cache, setting isAttenting to true for the experience with matching id from the feeds
      utils.experiences.feed.setInfiniteData({}, (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((p) => ({
            ...p,
            experiences: p.experiences.map((e) =>
              e.id === id ? updateExperience(e) : e,
            ),
          })),
        };
      });
      if (pathUserId) {
        utils.experiences.byUserId.setInfiniteData(
          { id: pathUserId },
          (old) => {
            if (!old) return old;
            return {
              ...old,
              pages: old.pages.map((p) => ({
                ...p,
                experiences: p.experiences.map((e) =>
                  e.id === id ? updateExperience(e) : e,
                ),
              })),
            };
          },
        );
      }

      if (pathQ) {
        utils.experiences.search.setInfiniteData({ q: pathQ }, (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((p) => ({
              ...p,
              experiences: p.experiences.map((e) =>
                e.id === id ? updateExperience(e) : e,
              ),
            })),
          };
        });
      }

      utils.experiences.byId.setData({ id }, (oldData) => {
        if (!oldData) return;
        return updateExperience(oldData);
      });

      const { dismiss } = toast({
        title: "Experiences added to favorites",
        description: "You added this experience to your favorites",
        variant: "success",
      });

      return { previousData, dismiss };
    },
    onError: (err, { id }, context) => {
      context?.dismiss?.();

      toast({
        title: "Could not favorite the experience",
        description: err.message,
        variant: "destructive",
      });

      utils.experiences.byId.setData({ id }, context?.previousData.byId);
      utils.experiences.feed.setInfiniteData({}, context?.previousData.feed);
      if (pathQ) {
        utils.experiences.search.setInfiniteData(
          { q: pathQ },
          context?.previousData.search,
        );
      }
      if (pathUserId) {
        utils.experiences.byUserId.setInfiniteData(
          { id: pathUserId },
          context?.previousData.byUserId,
        );
      }
    },
  });

  const unfavoriteMutation = trpc.experiences.unfavorite.useMutation({
    onMutate: async ({ id }) => {
      function updateExperience<
        T extends {
          isFavorited: boolean;
          favoritesCount: number;
        },
      >(oldData: T): T {
        return {
          ...oldData,
          isFavorited: false,
          favoritesCount: Math.max(0, oldData.favoritesCount - 1),
        };
      }

      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await Promise.all([
        utils.experiences.byId.cancel({ id }),
        utils.experiences.feed.cancel(),
        utils.experiences.favorites.cancel(),
        ...(pathUserId
          ? [utils.experiences.byUserId.cancel({ id: pathUserId })]
          : []),
        ...(pathQ ? [utils.experiences.search.cancel()] : []),
      ]);
      // Snapshot of the previous value
      const previousData = {
        byId: utils.experiences.byId.getData({ id }),
        feed: utils.experiences.feed.getInfiniteData(),
        favorites: utils.experiences.favorites.getInfiniteData(),
        byUserId: pathUserId
          ? utils.experiences.byUserId.getData({ id: pathUserId })
          : undefined,
        search: pathQ
          ? utils.experiences.search.getInfiniteData({ q: pathQ })
          : undefined,
      };

      // Updating the cache, setting isAttenting to true for the experience with matching id from the feeds
      utils.experiences.feed.setInfiniteData({}, (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((p) => ({
            ...p,
            experiences: p.experiences.map((e) =>
              e.id === id ? updateExperience(e) : e,
            ),
          })),
        };
      });
      if (pathUserId) {
        utils.experiences.byUserId.setInfiniteData(
          { id: pathUserId },
          (old) => {
            if (!old) return old;
            return {
              ...old,
              pages: old.pages.map((p) => ({
                ...p,
                experiences: p.experiences.map((e) =>
                  e.id === id ? updateExperience(e) : e,
                ),
              })),
            };
          },
        );
      }

      if (pathQ) {
        utils.experiences.search.setInfiniteData({ q: pathQ }, (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((p) => ({
              ...p,
              experiences: p.experiences.map((e) =>
                e.id === id ? updateExperience(e) : e,
              ),
            })),
          };
        });
      }

      utils.experiences.byId.setData({ id }, (oldData) => {
        if (!oldData) return;
        return updateExperience(oldData);
      });

      utils.experiences.favorites.setInfiniteData({}, (oldData) => {
        if (!oldData) return;
        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            experiences: page.experiences.filter((e) => e.id !== id), // eliminate the experience from the favorites page optimisticly
          })),
        };
      });

      const { dismiss } = toast({
        title: "Experiences removed from favorites",
        description: "You added removed this experience from your favorites",
        variant: "success",
      });

      return { previousData, dismiss };
    },
    onError: (err, { id }, context) => {
      context?.dismiss?.();

      toast({
        title: "Could not unfavorite the experience",
        description: err.message,
        variant: "destructive",
      });

      utils.experiences.byId.setData({ id }, context?.previousData.byId);
      utils.experiences.feed.setInfiniteData({}, context?.previousData.feed);
      utils.experiences.favorites.setInfiniteData(
        {},
        context?.previousData.favorites,
      );
      if (pathQ) {
        utils.experiences.search.setInfiniteData(
          { q: pathQ },
          context?.previousData.search,
        );
      }
      if (pathUserId) {
        utils.experiences.byUserId.setInfiniteData(
          { id: pathUserId },
          context?.previousData.byUserId,
        );
      }
    },
  });

  return {
    editMutation,
    deleteMutation,
    attendMutation,
    unattendMutation,
    favoriteMutation,
    unfavoriteMutation,
  };
}
