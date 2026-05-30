import { Notification } from "@advanced-react/server/database/schema";
import React from "react";
import { NotificationForList } from "../types";
import Spinner from "@/features/shared/components/ui/Spinner";
import { NotificationCard } from "./NotificationCard";

type NotificationListProps = {
  notifications: NotificationForList[];
  isLoading?: boolean;
};

const NotificationList = ({
  notifications,
  isLoading,
}: NotificationListProps) => {
  return (
    <div className="flex flex-col  justify-center space-y-4">
      {notifications.map((notification) => (
        <NotificationCard notification={notification} key={notification.id} />
      ))}

      {isLoading && (
        <div className="flex justify-center">
          <Spinner className="size-8" />
        </div>
      )}

      {!isLoading && notifications.length === 0 && (
        <div className="flex justify-center">
          <span className="font-bold">No notifications found</span>
        </div>
      )}
    </div>
  );
};

export default NotificationList;
