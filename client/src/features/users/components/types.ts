import { User } from "@advanced-react/server/database/schema";

export type UserForDetails = User & {
  hostedExperiencesCount: number;
};
