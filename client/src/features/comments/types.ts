import {
  User,
  Comment,
  Experience,
} from "@advanced-react/server/database/schema";

type CommentWithUser = Comment & {
  user: User;
};

export type CommentWithExperience = Comment & {
  experience: Experience;
};
export type CommentForList = CommentWithUser & CommentWithExperience;


export type OptimisticComment = CommentWithUser & CommentWithExperience & {
  optimistic: true;
};