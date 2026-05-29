import Card from "@/features/shared/components/ui/Card";
import { ExperienceForList } from "../types";
import { LinkIcon, MessageSquare } from "lucide-react";
import Link from "@/features/shared/components/ui/Link";
import { Button } from "@/features/shared/components/ui/Button";
import UserAvatar from "@/features/users/components/UserAvatar";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
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
      <Link
        to="/users/$userId"
        params={{ userId: experience.user.id }}
        variant={"ghost"}
      >
        <div className="">{experience.user.name}</div>
      </Link>

      <Link
        to="/experiences/$experienceId"
        params={{ experienceId: experience.id }}
      >
        <h2 className="text-secondary-500 dark:text-primary-500 text-xl font-bold">
          {experience.title}
        </h2>
      </Link>
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
    <Button variant={"link"} className="flex justify-start" asChild>
      <Link
        to="/experiences/$experienceId"
        variant={"ghost"}
        params={{ experienceId: experience.id }}
      >
        <MessageSquare className="size-6" />
        <span>{experience.commentsCount}</span>
      </Link>
    </Button>
  );
};

type ExperienceCardAvatarProps = Pick<ExperienceCardProps, "experience">;

const ExperienceCardAvatar = ({ experience }: ExperienceCardAvatarProps) => {
  return (
    <Link
      to="/users/$userId"
      params={{ userId: experience.user.id }}
      variant={"ghost"}
    >
      <UserAvatar user={experience.user} showName={false} />
    </Link>
  );
};

const ExperienceCard = ({ experience }: ExperienceCardProps) => {
  console.log("EXPERIENCE");
  console.log(experience);
  return (
    <Card className="overflow-hidden p-0">
      <ExperienceMedia experience={experience} />
      <div className="flex items-start gap-2 p-2">
        <ExperienceCardAvatar experience={experience} />
        <div className="space-y-2 p-2">
          <ExperienceHeader experience={experience} />
          <ExperienceContent experience={experience} />
          <ExperienceMeta experience={experience} />
          <ExperienceCardMetricButtons experience={experience} />
          <ExperienceCardActionButtons experience={experience} />
        </div>
      </div>
    </Card>
  );
};

type ExperienceCardOwnerProps = Pick<ExperienceCardProps, "experience">;
const ExperienceOwnerButtons = ({ experience }: ExperienceCardOwnerProps) => {
  return (
    <Link
      to="/experiences/$experienceId/edit"
      params={{ experienceId: experience.id }}
      className="text-sm"
      variant={"underline"}
    >
      Edit
    </Link>
  );
};

type ExperienceCardActionButtonsProps = Pick<ExperienceCardProps, "experience">;
const ExperienceCardActionButtons = ({
  experience,
}: ExperienceCardActionButtonsProps) => {
  const { currentUser } = useCurrentUser();

  if (currentUser?.id === experience.userId)
    return <ExperienceOwnerButtons experience={experience} />;

  return null;
};
export default ExperienceCard;
