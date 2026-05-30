import Card from "@/features/shared/components/ui/Card";
import Link from "@/features/shared/components/ui/Link";
import { User } from "@advanced-react/server/database/schema";
import React from "react";
import UserAvatar from "./UserAvatar";

type UserCardProps = {
  user: User;
};

const UserCard = ({ user }: UserCardProps) => {
  return (
    <Card>
      <Link to="/users/$userId" params={{ userId: user.id }} variant={"ghost"}>
        <UserAvatar user={user} showName={true} />
      </Link>
    </Card>
  );
};

export default UserCard;
