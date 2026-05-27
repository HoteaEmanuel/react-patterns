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

type CommentCreateFormData = z.infer<typeof commentValidationSchema>;

type CommentCreateFormProps = {
  experienceId: Experience["id"];
};

const CommentCreateForm = ({ experienceId }: CommentCreateFormProps) => {
  const { toast } = useToast();
  const utils = trpc.useUtils();
  const form = useForm<CommentCreateFormData>({
    resolver: zodResolver(commentValidationSchema),
    defaultValues: {
      content: "",
    },
  });
  const addCommentMutation = trpc.comments.add.useMutation({
    onError: (err) => {
      toast({
        title: "Failed to add comment",
        description: err.message,
        variant: "destructive",
      });
    },
    onSuccess: async () => {
      await Promise.all([
        utils.comments.byExperienceId.invalidate({
          experienceId,
        }),
        utils.experiences.feed.invalidate({}),
      ]);

      form.reset();
    },
  });
  const handleSubmit = form.handleSubmit((data) => {
    addCommentMutation.mutate({
      content: data.content,
      experienceId,
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

        <Button type="submit" disabled={addCommentMutation.isPending}>
          {addCommentMutation.isPending ? "Saving..." : "Add comment"}
        </Button>
      </form>
    </Form>
  );
};

export default CommentCreateForm;
