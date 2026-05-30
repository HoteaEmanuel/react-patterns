import Card from "@/features/shared/components/ui/Card";
import Link from "@/features/shared/components/ui/Link";
import { User } from "@advanced-react/server/database/schema";
import React from "react";
import UserAvatar from "./UserAvatar";
import { UserWithContext } from "./types";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";

type UserCardProps = {
  user: UserWithContext;
  rightComponent?: (user: UserWithContext) => React.ReactNode;
};

const UserCard = ({ user, rightComponent }: UserCardProps) => {
  return (
    <Card className="flex items-center justify-between">
      <Link to="/users/$userId" params={{ userId: user.id }} variant={"ghost"}>
        <UserAvatar user={user} showName={true} />
      </Link>
      {rightComponent && rightComponent(user)}
    </Card>
  );
};

export default UserCard;
