import Card from "@/features/shared/components/ui/Card";
import Spinner from "@/features/shared/components/ui/Spinner";
import { UserForList, UserWithContext } from "./types";
import UserCard from "./UserCard";

type UserListProps = {
  users: UserForList[];
  isLoading?: boolean;
  noUsersMessage?: string;
  rightComponent?: (user: UserWithContext) => React.ReactNode;
};

export function UserList({
  users,
  isLoading,
  noUsersMessage,
  rightComponent,
}: UserListProps) {
  return (
    <Card className="space-y-4">
      {isLoading && (
        <div className="flex justify-center">
          <Spinner />
        </div>
      )}

      {!isLoading && users.length === 0 && (
        <div className="flex justify-center">
          <span>{noUsersMessage || "No users found"}</span>
        </div>
      )}
      {users.map((user) => (
        <UserCard user={user} key={user.id} rightComponent={rightComponent} />
      ))}
    </Card>
  );
}
