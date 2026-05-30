import { useState } from "react";
import {
  CommentForList,
  CommentWithExperience,
  OptimisticComment,
} from "../types";
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
import { useToast } from "@/features/shared/hooks/useToast";
import UserAvatar from "@/features/users/components/UserAvatar";
import Link from "@/features/shared/components/ui/Link";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
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
        {!isEditing && <CommentCardContent comment={comment} />}
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
            experience={comment.experience}
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
      <UserAvatar user={comment.user} />
      <Link to="/users/$userId" params={{ userId: comment.user.id }}>
        <span>{comment.user.name} </span>
      </Link>

      <time className="text-neutral-500">
        {" "}
        • {new Date(comment.createdAt).toLocaleDateString()}
      </time>
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
  comment: CommentWithExperience;
};

const CommentCardButtons = ({
  setIsEditing,
  isDeleting,
  setIsDeleting,
  comment,
}: CommentCardButtonsProps) => {
  const { toast } = useToast();
  const utils = trpc.useUtils();
  const { currentUser } = useCurrentUser();
  const deleteCommentMutation = trpc.comments.delete.useMutation({
    onMutate: async ({ id }) => {
      if (!currentUser) {
        return;
      }
      await Promise.all([
        utils.comments.byExperienceId.cancel({
          experienceId: comment.experienceId,
        }),
        utils.experiences.byId.cancel({ id: comment.experienceId }),
      ]);

      const previousData = {
        byExperienceId: utils.comments.byExperienceId.getData({
          experienceId: comment.experienceId,
        }),
        experience: utils.experiences.byId.getData({
          id: comment.experienceId,
        }),
      };

      // Optimistically update the comments list and experience's comments count
      utils.comments.byExperienceId.setData(
        { experienceId: comment.experienceId },
        (old) => {
          if (!old) return old;
          return old.filter((c) => c.id === id);
        },
      );

      utils.experiences.byId.setData({ id: comment.experienceId }, (old) => {
        if (!old) return old;
        return {
          ...old,
          commentsCount: old.commentsCount - 1,
        };
      });
      // Show a toast immediately
      const { dismiss } = toast({
        title: "Comment deleted",
        variant: "success",
      });

      setIsDeleting(false);
      return { previousData, dismiss };
    },
    onError: (err, _, context) => {
      utils.comments.byExperienceId.setData(
        { experienceId: comment.experienceId },
        context?.previousData.byExperienceId,
      );

      utils.experiences.byId.setData(
        {
          id: comment.experienceId,
        },
        context?.previousData.experience,
      );

      toast({
        title: "Failed to delete comment",
        description: err.message,
      });
    },
  });
  const isCommentOwner = currentUser?.id === comment.userId;
  const isExperienceOwner = currentUser?.id === comment.experience.userId;
  if (!currentUser) return null;
  return (
    <div className="flex gap-4">
      {isCommentOwner && (
        <Button
          variant={"link"}
          onClick={() => setIsEditing(true)}
          disabled={(comment as OptimisticComment).optimistic} // disable edit for optimistic comments
        >
          Edit
        </Button>
      )}
      {(isCommentOwner || isExperienceOwner) && (
        <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
          <DialogTrigger asChild>
            <Button
              variant={"destructive-link"}
              disabled={(comment as OptimisticComment).optimistic} // disable delete for optimistic comments
            >
              Delete
            </Button>
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
      )}
    </div>
  );
};
export default CommentCard;
