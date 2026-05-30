import { trpc } from "@/router";
import { Experience } from "@advanced-react/server/database/schema";
import CommentsList from "./CommentsList";
import CommentCreateForm from "./CommentCreateForm";
import ErrorComponent from "@/features/shared/components/ErrorComponent";
import Card from "@/features/shared/components/ui/Card";
import Spinner from "@/features/shared/components/ui/Spinner";

type CommentsSectionProps = {
  experienceId: Experience["id"];
  commentsCount: number;
};

const CommentsSection = ({
  commentsCount,
  experienceId,
}: CommentsSectionProps) => {
  console.log(experienceId);
  const commentsQuery = trpc.comments.byExperienceId.useQuery({
    experienceId: experienceId,
  });

  const experienceQuery = trpc.experiences.byId.useQuery({ id: experienceId });
  if (commentsQuery.error || experienceQuery.error) return <ErrorComponent />;

  return (
    <div className="space-y-4">
      <h3 className="font-semibold"> Comments ({commentsCount})</h3>

      {experienceQuery.isPending || commentsQuery.isPending ? (
        <div className="flex justify-center">
          <Spinner />
        </div>
      ) : (
        <div>
          <Card>
            <CommentCreateForm experience={experienceQuery.data} />
          </Card>

          <CommentsList
            comments={commentsQuery.data ?? []}

          />
        </div>
      )}
    </div>
  );
};

export default CommentsSection;
