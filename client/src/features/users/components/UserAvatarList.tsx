import { Experience, User } from "@advanced-react/server/database/schema";
import React from "react";
import UserAvatar from "./UserAvatar";
import Link from "@/features/shared/components/ui/Link";

type UserAvatarListProps = {
  users: User[];
  totalCount: number;
  limit?: number;
  avatarClassName?: string;
  experienceId?: Experience["id"];
};

const UserAvatarList = ({
  users,
  totalCount,
  limit = 5,
  avatarClassName,
  experienceId,
}: UserAvatarListProps) => {
  const displayedUsers = users?.slice(0, limit);
  console.log(users);
  console.log("DISPLAY USERS");
  console.log(displayedUsers);
  const remainingCount = totalCount - limit;
  return (
    <div className="flex items-center">
      {displayedUsers?.map((user) => (
        <div className="-ml-2 first:ml-0" key={user.id}>
          <Link
            to="/users/$userId"
            params={{ userId: user.id }}
            variant={"ghost"}
            className="hover:opacity-80"
          >
            {" "}
            <UserAvatar key={user.id} user={user} className={avatarClassName} />
          </Link>
        </div>
      ))}
      {totalCount > limit && (
        <Link
          to="/experiences/$experienceId/attendees"
          params={{ experienceId }}
          variant={"ghost"}
          className="hover:opacity-80"
        >
          <span className="ml-1 flex size-10 cursor-pointer items-center justify-center rounded-full bg-neutral-200 text-sm text-neutral-500 hover:text-neutral-700 dark:bg-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200">
            +{remainingCount}
          </span>
        </Link>
      )}
    </div>
  );
};

export default UserAvatarList;
