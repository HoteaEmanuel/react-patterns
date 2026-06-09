import {
  User,
  Comment,
  Experience,
} from "@advanced-react/server/database/schema";

type CommentWithUser = Comment & {
  user: User;
};
type CommentWithLikedStatus = Comment & {
  isLiked:boolean
}

type CommentWithLikesCount=Comment & {
  likesCount:number
}
export type CommentWithExperience = Comment & {
  experience: Experience;
};
export type CommentForList = CommentWithUser & CommentWithExperience & CommentWithLikedStatus & CommentWithLikesCount & OptimisticComment;


export type OptimisticComment = CommentWithUser & CommentWithExperience & CommentWithLikedStatus & CommentWithLikesCount  &{
  optimistic: true;
};