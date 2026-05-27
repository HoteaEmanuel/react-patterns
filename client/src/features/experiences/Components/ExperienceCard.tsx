import Card from "@/features/shared/components/ui/Card";
import { ExperienceForList } from "../types";
import { LinkIcon, MessageSquare } from "lucide-react";
import CommentsSection from "@/features/comments/components/CommentsSection";
type ExperienceCardProps = {
  experience: ExperienceForList;
};
type ExperienceMediaProps = Pick<ExperienceCardProps, "experience">;

const ExperienceMedia = ({ experience }: ExperienceMediaProps) => {
  if (experience?.imageUrl === null) return null;
  return (
    <div className="aspect-video w-full">
      <img
        src={experience.imageUrl}
        alt="experience image"
        className="h-full w-full object-cover"
      />
    </div>
  );
};

type ExperienceCardHeaderProps = Pick<ExperienceCardProps, "experience">;

const ExperienceHeader = ({ experience }: ExperienceCardHeaderProps) => {
  return (
    <div className="w-full space-y-4">
      <div className="">{experience.user.name}</div>
      <h2 className="text-secondary-500 dark:text-primary-500 text-xl font-bold">
        {experience.title}
      </h2>
    </div>
  );
};

type ExperienceCardContentProps = Pick<ExperienceCardProps, "experience">;

const ExperienceContent = ({ experience }: ExperienceCardContentProps) => {
  return <p>{experience.content}</p>;
};

type ExperienceCardMetaProps = Pick<ExperienceCardProps, "experience">;

const ExperienceMeta = ({ experience }: ExperienceCardMetaProps) => {
  return (
    <div className="space-y-4">
      <time>{new Date(experience?.scheduledAt).toLocaleString()}</time>
      {experience.url && (
        <div className="">
          <LinkIcon
            size={16}
            className="text-secondary-500 dark:text-primary-500"
          />
          <a
            target="_blank"
            href={experience.url}
            className="text-secondary-500 dark:text-primary-500 hover:underline"
          >
            Event Details
          </a>
        </div>
      )}
    </div>
  );
};

type ExperienceCardMetricButtonsProps = Pick<ExperienceCardProps, "experience">;

const ExperienceCardMetricButtons = ({
  experience,
}: ExperienceCardMetricButtonsProps) => {
  return (
    <div className="flex items-center gap-2">
      <MessageSquare className="size-6" />
      <span>{experience.commentsCount}</span>
    </div>
  );
};

const ExperienceCard = ({ experience }: ExperienceCardProps) => {
  console.log("EXPERIENCE");
  console.log(experience);
  return (
    <Card className="overflow-hidden p-0">
      <ExperienceMedia experience={experience} />
      <div className="space-y-2 p-2">
        <ExperienceHeader experience={experience} />
        <ExperienceContent experience={experience} />
        <ExperienceMeta experience={experience} />
        <ExperienceCardMetricButtons experience={experience} />
        <CommentsSection
          commentsCount={experience.commentsCount}
          experienceId={experience.id}
        />
      </div>
    </Card>
  );
};

export default ExperienceCard;
