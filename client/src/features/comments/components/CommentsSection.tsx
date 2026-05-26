import { trpc } from "@/trpc";
import { Experience } from "@advanced-react/server/database/schema";
import CommentsList from "./CommentsList";

type CommentsSectionProps = {
  experienceId: Experience["id"];
  commentsCount: number;
};

const CommentsSection = ({
  commentsCount,
  experienceId,
}: CommentsSectionProps) => {
  console.log(experienceId);
  const commentsQuery = trpc.comments.byExperienceId.useQuery(
    {
      experienceId: experienceId,
    },
    {
      enabled: commentsCount > 0,
    },
  );
  if (commentsQuery.isError) return <div>Something went wrong</div>;
  return (
    <div className="space-y-4">
      <div className="flex gap-2">Comments {commentsCount}</div>
      <CommentsList
        comments={commentsQuery.data ?? []}
        isLoading={commentsQuery.isLoading}
      />
    </div>
  );
};

export default CommentsSection;
