import { useState } from "react";
import { CommentForList } from "../types";
import Card from "@/features/shared/components/ui/Card";
import { Button } from "@/features/shared/components/ui/Button";
import CommentEditForm from "./CommentEditForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/features/shared/components/ui/Dialog";
import { trpc } from "@/router";
import { Comment } from "@advanced-react/server/database/schema";
import { useToast } from "@/features/shared/hooks/useToast";
type CommentCardProps = {
  comment: CommentForList;
};

const CommentCard = ({ comment }: CommentCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  return (
    <div>
      <Card className="space-y-4">
        <CommentCardHeader comment={comment} />
        <CommentCardContent comment={comment} />
        {!isEditing && (
          <CommentCardButtons
            setIsEditing={setIsEditing}
            isDeleting={isDeleting}
            setIsDeleting={setIsDeleting}
            comment={comment}
          />
        )}

        {isEditing && (
          <CommentEditForm
            comment={comment}
            setIsEditing={setIsEditing}
            experienceId={comment.experienceId}
          />
        )}
      </Card>
    </div>
  );
};

type CommentCardHeaderProps = Pick<CommentCardProps, "comment">;

const CommentCardHeader = ({ comment }: CommentCardHeaderProps) => {
  return (
    <div className="flex items-center gap-2">
      <span>{comment.user.name}</span>
      <time> {new Date(comment.createdAt).toLocaleDateString()}</time>
    </div>
  );
};

type CommentCardContentProps = Pick<CommentCardProps, "comment">;
const CommentCardContent = ({ comment }: CommentCardContentProps) => {
  return (
    <div className="">
      <div className="whitespace-pre-wrap">{comment.content}</div>
    </div>
  );
};

type CommentCardButtonsProps = {
  setIsEditing: (value: boolean) => void;
  isDeleting: boolean;
  setIsDeleting: (value: boolean) => void;
  comment: Comment;
};

const CommentCardButtons = ({
  setIsEditing,
  isDeleting,
  setIsDeleting,
  comment,
}: CommentCardButtonsProps) => {
  const { toast } = useToast();
  const utils = trpc.useUtils();
  const deleteCommentMutation = trpc.comments.delete.useMutation({
    onError: (err) => {
      toast({
        title: "Failed to delete comment",
        description: err.message,
      });
    },
    onSuccess: async () => {
      await Promise.all([
        utils.comments.byExperienceId.invalidate({
          experienceId: comment.experienceId,
        }),
      ]);

      setIsDeleting(false);
      toast({
        title: "Comment deleted!",
        description: "Comment was deleted successfully!",
        color: "green",
      });
    },
  });
  return (
    <div className="flex gap-4">
      <Button variant={"link"} onClick={() => setIsEditing(true)}>
        Edit
      </Button>

      <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
        <DialogTrigger asChild>
          <Button variant={"destructive-link"}>Delete</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete comment</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this comment? This action cannot
              be undone
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button onClick={() => setIsDeleting(false)} variant={"link"}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                deleteCommentMutation.mutate({
                  id: comment.id,
                });
              }}
              variant={"destructive-link"}
              disabled={deleteCommentMutation.isPending}
            >
              {deleteCommentMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default CommentCard;
