import { ExperienceForDetails } from "../types";
import Card from "@/features/shared/components/ui/Card";
import { LinkIcon } from "lucide-react";

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
export default ExperienceDetails;
