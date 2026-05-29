import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { ExperienceForDetails } from "../types";
import Card from "@/features/shared/components/ui/Card";
import { Experience } from "@advanced-react/server/database/schema";
import { LinkIcon } from "lucide-react";
import Link from "@/features/shared/components/ui/Link";
import { Button } from "@/features/shared/components/ui/Button";
import ExperienceDeleteDialog from "./ExperienceDeleteDialog";
import { router } from "@/router";
import ExperienceAttendButton from "./ExperienceAttendButton";

type ExperienceDetailsProps = {
  experience: ExperienceForDetails;
};

const ExperienceDetails = ({ experience }: ExperienceDetailsProps) => {
  return (
    <Card className="p-0">
      <ExperienceCardMedia experience={experience} />
      <div className="space-y-4 p-2">
        <ExperienceDetailsHeader experience={experience} />
        <ExperienceDetailsContent experience={experience} />
        <ExperienceDetailsMeta experience={experience} />
        <ExperienceCardActionButtons experience={experience} />
      </div>
    </Card>
  );
};

type ExperienceDetailsMediaProps = Pick<ExperienceDetailsProps, "experience">;

const ExperienceCardMedia = ({ experience }: ExperienceDetailsMediaProps) => {
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

type ExperienceDetailsHeaderProps = Pick<ExperienceDetailsProps, "experience">;

const ExperienceDetailsHeader = ({
  experience,
}: ExperienceDetailsHeaderProps) => {
  return <h1 className="text-2xl font-semibold">{experience.title}</h1>;
};

type ExperienceDetailsContentProps = Pick<ExperienceDetailsProps, "experience">;

const ExperienceDetailsContent = ({
  experience,
}: ExperienceDetailsContentProps) => {
  return (
    <p className="text-neutral-600 dark:text-neutral-400">
      {experience.content}
    </p>
  );
};

type ExperienceDetailsMetaProps = Pick<ExperienceDetailsProps, "experience">;

const ExperienceDetailsMeta = ({ experience }: ExperienceDetailsMetaProps) => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2">
        <time>{new Date(experience?.scheduledAt).toLocaleString()}</time>
      </div>

      {experience.url && (
        <div className="flex items-center gap-2">
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

type ExperienceCardOwnerProps = {
  experience: Experience;
};

const ExperienceOwnerButtons = ({ experience }: ExperienceCardOwnerProps) => {
  return (
    <div className="flex gap-4">
      <Button asChild className="size-10" variant={"ghost"}>
        <Link
          to="/experiences/$experienceId/edit"
          params={{ experienceId: experience.id }}
          variant={"ghost"}
        >
          Edit
        </Link>
      </Button>
      <ExperienceDeleteDialog
        experienceId={experience.id}
        onSuccess={() => {
          router.navigate({ to: "/" });
        }}
      />
    </div>
  );
};

type ExperienceCardActionButtonsProps = {
  experience: ExperienceForDetails;
};
const ExperienceCardActionButtons = ({
  experience,
}: ExperienceCardActionButtonsProps) => {
  const { currentUser } = useCurrentUser();

  if (currentUser?.id === experience.userId)
    return (
      <div className=" ">
        <ExperienceOwnerButtons experience={experience} />
      </div>
    );

    if (currentUser)
    return (
      <ExperienceAttendButton
        experienceId={experience.id}
        isAttending={experience.isAttending}
      />
    );

  return null;
};
export default ExperienceDetails;
