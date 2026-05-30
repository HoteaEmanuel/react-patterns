import { Experience } from "@advanced-react/server/database/schema";
import { z } from "zod";
import { commentValidationSchema } from "../../../../../shared/schema/comment";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/features/shared/components/ui/Form";
import { TextArea } from "@/features/shared/components/ui/TextArea";
import { Button } from "@/features/shared/components/ui/Button";
import { trpc } from "@/router";
import { useToast } from "@/features/shared/hooks/useToast";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { OptimisticComment } from "../types";

type CommentCreateFormData = z.infer<typeof commentValidationSchema>;

type CommentCreateFormProps = {
  experience: Experience;
};

const CommentCreateForm = ({ experience }: CommentCreateFormProps) => {
  const { toast } = useToast();
  const utils = trpc.useUtils();
  const { currentUser } = useCurrentUser();
  const form = useForm<CommentCreateFormData>({
    resolver: zodResolver(commentValidationSchema),
    defaultValues: {
      content: "",
    },
  });
  const addCommentMutation = trpc.comments.add.useMutation({
    onMutate: async ({ experienceId, content }) => {
      if (!currentUser) {
        return;
      }
      await Promise.all([
        utils.comments.byExperienceId.cancel({
          experienceId: experienceId,
        }),
        utils.experiences.byId.cancel({ id: experienceId }),
      ]);

      const optimisticComment: OptimisticComment = {
        id: Math.random(),
        content,
        experienceId: experience.id,
        userId: currentUser.id,
        user: currentUser,
        experience: experience,
        optimistic: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const previousData = {
        byExperienceId: utils.comments.byExperienceId.getData({ experienceId }),
        experience: utils.experiences.byId.getData({ id: experienceId }),
      };

      utils.comments.byExperienceId.setData({ experienceId }, (old) => {
        if (!old) return old;
        return [optimisticComment, ...old];
      });

      utils.experiences.byId.setData({ id: experienceId }, (old) => {
        if (!old) return old;
        return {
          ...old,
          commentsCount: old.commentsCount + 1,
        };
      });

      const { dismiss } = toast({
        title: "Comment added",
        variant: "success",
      });

      return { previousData, dismiss };
    },

    onSuccess: () => {
      form.reset();
      utils.comments.byExperienceId.invalidate({ experienceId: experience.id });
      utils.experiences.byId.invalidate({ id: experience.id });
    },
    onError: (err, { experienceId }, context) => {
      context?.dismiss?.();

      utils.comments.byExperienceId.setData(
        { experienceId },
        context?.previousData?.byExperienceId,
      );
      utils.experiences.byId.setData(
        { id: experienceId },
        context?.previousData?.experience,
      );
      toast({
        title: "Failed to add comment",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    addCommentMutation.mutate({
      content: data.content,
      experienceId: experience.id,
    });
  });

  if (!currentUser)
    return (
      <div className="text-center">
        <h2 className="font-semibold">Please log in to add comments</h2>
      </div>
    );

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <TextArea {...field} placeholder="Add a comment" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={addCommentMutation.isPending}>
          {addCommentMutation.isPending ? "Saving..." : "Add comment"}
        </Button>
      </form>
    </Form>
  );
};

export default CommentCreateForm;
