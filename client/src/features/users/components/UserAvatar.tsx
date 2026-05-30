import React from "react";
import { User } from "@advanced-react/server/database/schema";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/features/shared/components/ui/Avatar";
import { cn } from "@/lib/utils/cn";

type UserAvatarProps = {
  user: User;
  showName?: boolean;
  nameClassName?: string;
  className?: string;
};

const UserAvatar = ({
  user,
  className,
  nameClassName,
  showName,
}: UserAvatarProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Avatar className={className}>
        <AvatarImage
          src={user.avatarUrl ?? undefined}
          className="object-cover"

        />
        <AvatarFallback> {user.name.slice(0, 2)} </AvatarFallback>
      </Avatar>

      {showName && (
        <span
          className={cn(
            "text-neutral-600 dark:text-neutral-300",
            nameClassName,
          )}
        >
          {user.name}
        </span>
      )}
    </div>
  );
};

export default UserAvatar;
