import { Experience, User } from "@advanced-react/server/database/schema";

type ExperienceWithUser = Experience & {
  user: User;
};

type ExperienceWithUserContext = ExperienceWithUser & {
  isAttending: boolean;
};

type ExperienceWithCommentsCount = ExperienceWithUser & {
  commentsCount: number;
};

export type ExperienceForList = ExperienceWithUser &
  ExperienceWithCommentsCount &
  ExperienceWithUserContext;

export type ExperienceForDetails = ExperienceWithUser &
  ExperienceWithCommentsCount &
  ExperienceWithUserContext;
