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

type CommentEditFormData = z.infer<typeof commentValidationSchema>;

type CommentEditFormProps = {
  comment: Comment;
  experienceId: Experience["id"];
  setIsEditing: (value: boolean) => void;
};

const CommentEditForm = ({
  comment,
  experienceId,
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
  const editFormMutation = trpc.comments.edit.useMutation({
    onError: (err) => {
      toast({
        title: "Failed to edit comment",
        description: err.message,
        variant: "destructive",
      });
    },
    onSuccess: async () => {
      await Promise.all([
        utils.comments.byExperienceId.invalidate({
          experienceId,
        }),
      ]);

      form.reset();
      setIsEditing(false);
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
