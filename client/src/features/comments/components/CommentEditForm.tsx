import { z } from "zod";
import { commentValidationSchema } from "../../../../../shared/schema/comment";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Comment, Experience } from "@advanced-react/server/database/schema";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/features/shared/components/ui/Form";
import { TextArea } from "@/features/shared/components/ui/TextArea";
import { Button } from "@/features/shared/components/ui/Button";
import { trpc } from "@/router";
import { useToast } from "@/features/shared/hooks/useToast";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";

type CommentEditFormData = z.infer<typeof commentValidationSchema>;

type CommentEditFormProps = {
  comment: Comment;
  experience: Experience;
  setIsEditing: (value: boolean) => void;
};

const CommentEditForm = ({
  comment,
  experience,
  setIsEditing,
}: CommentEditFormProps) => {
  console.log("COMMENT IN EDIT", comment);
  const { toast } = useToast();
  const utils = trpc.useUtils();
  const form = useForm<CommentEditFormData>({
    resolver: zodResolver(commentValidationSchema),
    defaultValues: {
      content: comment.content,
    },
  });
  const { currentUser } = useCurrentUser();
  const editFormMutation = trpc.comments.edit.useMutation({
    onMutate: async ({ id, content }) => {
      if (!currentUser) {
        return;
      }
      await Promise.all([
        utils.comments.byExperienceId.cancel({
          experienceId: experience.id,
        }),
        utils.experiences.byId.cancel({ id: experience.id }),
      ]);

      const previousData = {
        byExperienceId: utils.comments.byExperienceId.getData({
          experienceId: experience.id,
        }),
        experience: utils.experiences.byId.getData({ id: experience.id }),
      };

      // Optimistically update the comments list and experience's comments count
      utils.comments.byExperienceId.setData(
        { experienceId: experience.id },
        (old) => {
          if (!old) return old;
          return old.map((comment) =>
            comment.id === id
              ? { ...comment, content, updatedAt: new Date().toISOString() }
              : comment,
          );
        },
      );

      // Show a toast immediately
      setIsEditing(false);
      form.reset();
      const { dismiss } = toast({
        title: "Comment edited",
        variant: "success",
      });

      return { previousData, dismiss };
    },
    onError: (err, _, context) => {
      utils.comments.byExperienceId.setData(
        {
          experienceId: experience.id,
        },
        context?.previousData.byExperienceId,
      );

      toast({
        title: "Failed to edit comment",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    editFormMutation.mutate({
      content: data.content,
      id: comment.id,
    });
  });

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
        <div className="flex gap-4">
          <Button type="submit" disabled={editFormMutation.isPending}>
            {editFormMutation.isPending ? "Saving..." : "Save"}
          </Button>

          <Button variant={"link"} onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CommentEditForm;
