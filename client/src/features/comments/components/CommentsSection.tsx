import { trpc } from "@/router";
import { Experience } from "@advanced-react/server/database/schema";
import CommentsList from "./CommentsList";
import CommentCreateForm from "./CommentCreateForm";

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
      <CommentCreateForm experienceId={experienceId} />
      <CommentsList
        comments={commentsQuery.data ?? []}
        isLoading={commentsQuery.isLoading}
      />
    </div>
  );
};

export default CommentsSection;
