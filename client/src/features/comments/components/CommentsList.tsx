import CommentCard from "./CommentCard";
import { CommentForList } from "../types";
type CommentsListProps = {
  comments: CommentForList[];
  noCommentsMessage?: string;
};
const CommentsList = ({
  comments,
  noCommentsMessage = "No comments yet",
}: CommentsListProps) => {
  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentCard key={comment.content} comment={comment} />
      ))}

      {comments.length === 0 && (
        <p className="text-center font-semibold">{noCommentsMessage}</p>
      )}
    </div>
  );
};

export default CommentsList;
