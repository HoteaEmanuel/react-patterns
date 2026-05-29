import { useToast } from "@/features/shared/hooks/useToast";
import { trpc } from "@/router";
import { Experience } from "@advanced-react/server/database/schema";
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
      function updateExperience<T extends { isAttending: boolean }>(
        experience: T,
      ): T {
        return {
          ...experience,
          isAttending: true,
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

      utils.experiences.byId.setData({ id }, (old) => {
        if (!old) return old;
        return updateExperience(old);
      });

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

      utils.experiences.search.setInfiniteData;

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

  return {
    editMutation,
    deleteMutation,
    attendMutation,
  };
}
