import { Experience, Tag, User } from "@advanced-react/server/database/schema";

type ExperienceWithUser = Experience & {
  user: User;
};

type ExperienceWithAttendeesCount = ExperienceWithUser & {
  attendeesCount: number;
};

type ExperienceWithUserContext = ExperienceWithUser & {
  isAttending: boolean;
  isFavorited:boolean,
};

type ExperienceWithCommentsCount = ExperienceWithUser & {
  commentsCount: number;
};


type ExperienceWithAttendes= Experience & {
  attendees: User[];
};


type ExperienceWithFavoritesCount= Experience & {
  favoritesCount: number
}

type ExperienceWithTags = Experience & {
  tags:Tag[]
}

export type ExperienceForList = ExperienceWithUser &
  ExperienceWithCommentsCount &
  ExperienceWithUserContext & ExperienceWithAttendeesCount & ExperienceWithAttendes & ExperienceWithFavoritesCount & ExperienceWithTags;


  
export type ExperienceForDetails = ExperienceWithUser &
  ExperienceWithCommentsCount &
  ExperienceWithUserContext & ExperienceWithAttendeesCount & ExperienceWithAttendes & ExperienceWithFavoritesCount & ExperienceWithTags;
