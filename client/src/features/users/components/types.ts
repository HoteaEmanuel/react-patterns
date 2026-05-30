import { User } from "@advanced-react/server/database/schema";

type UserWithHostedExperiencesCount = User & {
  hostedExperiencesCount: number;
};

type UserWithFollowersCount = User & {
  followersCount: number;
};

type UserWithFollowingCount = User & {
  followingCount: number;
};

export type UserForDetails = UserWithHostedExperiencesCount &
  UserWithFollowersCount &
  UserWithFollowingCount;

export type UserWithContext = User & {
  isFollowing: boolean;
};
export type UserForList = User & UserWithContext;
