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
import UserAvatarList from "@/features/users/components/UserAvatarList";
import UserAvatar from "@/features/users/components/UserAvatar";
import ExperienceFavoriteButton from "./ExperienceFavoriteButton";
import TagList from "@/features/tags/components/TagList";
import { LocationPicker } from "@/features/shared/components/ui/LocationPicker";
import LocationDisplay from "@/features/shared/components/LocationDisplay";
import { LocationData } from "../../../../../shared/schema/experience";

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
        <ExperienceCardTags experience={experience} />
        <ExperienceDetailsMeta experience={experience} />

        <ExperienceCardActionButtons experience={experience} />
        <div className="space-y-4 border-t border-neutral-200 py-4 dark:border-neutral-700">
          <ExperienceAttendesDetails experience={experience} />
        </div>

        <ExperienceLocation experience={experience} />
      </div>
    </Card>
  );
};

type ExperienceWithTagsProps = Pick<ExperienceDetailsProps, "experience">;
const ExperienceCardTags = ({ experience }: ExperienceWithTagsProps) => {
  return <TagList tags={experience.tags} />;
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
      <div className="flex items-center gap-2">
        <ExperienceFavoriteButton
          experienceId={experience.id}
          isFavorited={experience.isFavorited}
          favoritesCount={experience.favoritesCount}
        />
        <ExperienceAttendButton
          experienceId={experience.id}
          isAttending={experience.isAttending}
        />
      </div>
    );

  return null;
};

type ExperienceAttendesDetailsProps = Pick<
  ExperienceDetailsProps,
  "experience"
>;

const ExperienceAttendesDetails = ({
  experience,
}: ExperienceAttendesDetailsProps) => {
  return (
    <div className="space-y-2">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Host</h2>
        <UserAvatarList totalCount={1} users={[experience.user]} limit={1} />
      </div>
      <div className="space-y-2">
        <Link
          to="/experiences/$experienceId/attendees"
          params={{ experienceId: experience.id }}
          variant={"underline"}
        >
          <h2 className="text-lg font-semibold">
            Attendees ({experience.attendeesCount})
          </h2>
        </Link>

        <UserAvatarList
          users={experience.attendees}
          totalCount={experience.attendeesCount}
          limit={5}
          experienceId={experience.id}
          // avatarClassName="size-8"
        />
      </div>
    </div>
  );
};

type ExperienceLocationProps = Pick<ExperienceDetailsProps, "experience">;
const ExperienceLocation = ({ experience }: ExperienceLocationProps) => {
  const location = experience?.location
    ? JSON.parse(experience.location) as LocationData
    : null;

  if (!location) return null;

  return <LocationDisplay location={location} zoom={13} />;
};

export default ExperienceDetails;
