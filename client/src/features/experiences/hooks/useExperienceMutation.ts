import { useToast } from "@/features/shared/hooks/useToast";
import { trpc } from "@/router";
import { Experience } from "@advanced-react/server/database/schema";

type ExperienceOptionsProps = {
  edit?: {
    onSuccess?: (id: Experience["id"]) => void;
  };
};

export function useExperienceMutation({ edit }: ExperienceOptionsProps) {
  const { toast } = useToast();
  const utils = trpc.useUtils();
  const editMutation = trpc.experiences.edit.useMutation({
    onError: (err) => {
      toast({
        title: "Failed to edit experience",
        description: err.message,
        variant: "destructive",
      });
    },
    onSuccess: async ({ id }) => {
      await utils.experiences.byId.invalidate({ id });
      toast({
        title: "Experience updated succesfully!",
        variant: "success",
      });

      edit?.onSuccess?.(id);
    },
  });

  return {
    editMutation,
  };
}
