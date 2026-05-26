import { CommentForList } from "../types";
import Card from "@/features/shared/components/ui/Card";

type CommentCardProps = {
  comment: CommentForList;
};

const CommentCard = ({ comment }: CommentCardProps) => {
  return (
    <Card className="py space-y-4">
      <CommentCardHeader comment={comment} />
      <CommentCardContent comment={comment} />
    </Card>
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
export default CommentCard;
