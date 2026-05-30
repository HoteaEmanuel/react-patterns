import { Experience, User } from "@advanced-react/server/database/schema";

type ExperienceWithUser = Experience & {
  user: User;
};

type ExperienceWithAttendeesCount = ExperienceWithUser & {
  attendeesCount: number;
};

type ExperienceWithUserContext = ExperienceWithUser & {
  isAttending: boolean;
};

type ExperienceWithCommentsCount = ExperienceWithUser & {
  commentsCount: number;
};


type ExperienceWithAttendes= ExperienceWithUser & {
  attendees: User[];
};

export type ExperienceForList = ExperienceWithUser &
  ExperienceWithCommentsCount &
  ExperienceWithUserContext & ExperienceWithAttendeesCount & ExperienceWithAttendes;

export type ExperienceForDetails = ExperienceWithUser &
  ExperienceWithCommentsCount &
  ExperienceWithUserContext & ExperienceWithAttendeesCount & ExperienceWithAttendes;
