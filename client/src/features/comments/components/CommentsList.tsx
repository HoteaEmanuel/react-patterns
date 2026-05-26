import { CommentForList } from "@/features/experiences/types";
import Spinner from "@/features/shared/components/ui/Spinner";
import React from "react";
import CommentCard from "./CommentCard";
type CommentsListProps = {
  comments: CommentForList[];
  isLoading?: boolean;
  noCommentsMessage?: string;
};
const CommentsList = ({
  comments,
  isLoading,
  noCommentsMessage = "No comments found",
}: CommentsListProps) => {
  return (
    <div className="">
      {comments.map((comment) => (
            <CommentCard key={comment.content} comment={comment}/>
      ))}

      {isLoading && (
        <div className="flex justify-center">
          <Spinner className="size-4" />
        </div>
      )}

      {!isLoading && comments.length === 0 && (
        <p className="text-center font-semibold">{noCommentsMessage}</p>
      )}
    </div>
  );
};

export default CommentsList;
