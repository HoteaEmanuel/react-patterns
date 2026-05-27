
import Spinner from "@/features/shared/components/ui/Spinner";
import CommentCard from "./CommentCard";
import { CommentForList } from "../types";
type CommentsListProps = {
  comments: CommentForList[];
  isLoading?: boolean;
  noCommentsMessage?: string;
};
const CommentsList = ({
  comments,
  isLoading,
  noCommentsMessage = "No comments yet",
}: CommentsListProps) => {
  return (
    <div className="space-y-4">
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
