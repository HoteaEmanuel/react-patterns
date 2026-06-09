import { Button } from "@/features/shared/components/ui/Button";
import { useToast } from "@/features/shared/hooks/useToast";
import { cn } from "@/lib/utils/cn";
import { trpc } from "@/router";
import { Comment } from "@advanced-react/server/database/schema";
import { useParams } from "@tanstack/react-router";
import { Heart } from "lucide-react";

type CommentLikeButton = {
  commentId: Comment["id"];
  isLiked?: boolean;
  likesCount: number;
  disabled?: boolean;
};

const CommentLikeButton = ({
  commentId,
  likesCount,
  isLiked,
  disabled = false,
}: CommentLikeButton) => {
  const utils = trpc.useUtils();
  const { toast } = useToast();
  const { experienceId } = useParams({ strict: false });
  const likeCommentMutation = trpc.comments.like.useMutation({
    onMutate: async () => {
      console.log("LIKE MUTATION");
      if (!experienceId) return;

      function updateComment<
        T extends { isLiked: boolean; likesCount: number },
      >(comment: T) {
        return {
          ...comment,
          isLiked: true,
          likesCount: comment.likesCount + 1,
        };
      }

      await utils.comments.byExperienceId.cancel({ experienceId });
      const previousData = {
        byExperienceId: utils.comments.byExperienceId.getData({
          experienceId,
        }),
      };

      console.log("COMMENT CACHE BEFORE");
      console.log(previousData.byExperienceId);

      utils.comments.byExperienceId.setData({ experienceId }, (oldData) => {
        if (!oldData) return null;
        return oldData.map((c) => (c.id === commentId ? updateComment(c) : c));
      });

      console.log("COMMENT CACHE BEFORE");
      console.log(utils.comments.byExperienceId.getData({ experienceId }));
      return { previousData };
    },
    onSuccess: () => {},
    onError: (err, _variables, context) => {
      toast({
        title: "Failed to like comment",
        variant: "destructive",
        description: err.message,
      });
      if (!experienceId) return;
      utils.comments.byExperienceId.setData(
        { experienceId },
        context?.previousData.byExperienceId,
      );
    },
  });

  const unlikeCommentMutation = trpc.comments.unlike.useMutation({
    onMutate: async () => {
      console.log("UNLIKE MUTATIONB");
      if (!experienceId) return;

      function updateComment<
        T extends { isLiked: boolean; likesCount: number },
      >(comment: T) {
        return {
          ...comment,
          isLiked: false,
          likesCount: Math.max(0, comment.likesCount - 1),
        };
      }

      await utils.comments.byExperienceId.cancel({ experienceId });
      const previousData = {
        byExperienceId: utils.comments.byExperienceId.getData({
          experienceId,
        }),
      };

      utils.comments.byExperienceId.setData({ experienceId }, (oldData) => {
        if (!oldData) return null;
        return oldData.map((c) => (c.id === commentId ? updateComment(c) : c));
      });
      return { previousData };
    },
    onSuccess: () => {},
    onError: (err, _variables, context) => {
      toast({
        title: "Failed to unlike comment",
        variant: "destructive",
        description: err.message,
      });
      if (!experienceId) return;
      utils.comments.byExperienceId.setData(
        { experienceId },
        context?.previousData.byExperienceId,
      );
    },
  });
  return (
    <Button
      type="button"
      variant={"link"}
      onClick={() =>
        isLiked
          ? unlikeCommentMutation.mutate({ id: commentId })
          : likeCommentMutation.mutate({ id: commentId })
      }
      disabled={
        unlikeCommentMutation.isPending ||
        likeCommentMutation.isPending ||
        disabled
      }
    >
      <Heart
        className={cn("size-4", isLiked ? "fill-red-500" : "text-red-500")}
      />

      {likesCount}
    </Button>
  );
};

export default CommentLikeButton;
