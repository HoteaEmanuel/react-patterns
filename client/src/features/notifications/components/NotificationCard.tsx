import Card from "@/features/shared/components/ui/Card";
import { NotificationForList } from "../types";
import { LinkProps } from "@tanstack/react-router";
import Link from "@/features/shared/components/ui/Link";
import { format } from "date-fns/format";
import { trpc } from "@/router";
import { Toast } from "@radix-ui/react-toast";
import { useToast } from "@/features/shared/hooks/useToast";

type NotificationCardProps = {
  notification: NotificationForList;
};
export function NotificationCard({ notification }: NotificationCardProps) {
  let linkProps: Pick<LinkProps, "to" | "params"> | undefined;
  const { toast } = useToast();
  // Construct the link dinamically
  if (
    [
      "user_commented_experience",
      "user_attending_experience",
      "user_unattending_experience",
    ].includes(notification.type) &&
    notification.experienceId
  ) {
    linkProps = {
      to: "/experiences/$experienceId",
      params: { experienceId: notification.experienceId },
    };
  } else if (
    notification.type === "user_followed_user" &&
    notification.fromUserId
  ) {
    linkProps = {
      to: "/users/$userId",
      params: { userId: notification.fromUserId },
    };
  }
  const utils = trpc.useUtils();

  const markAsRead = trpc.notifications.markAsRead.useMutation({
    onMutate: async ({ id }) => {
      await utils.notifications.feed.cancel();
      await utils.notifications.unreadCount.cancel();
      const previousData = {
        feed: utils.notifications.feed.getData(),
        unreadCount: utils.notifications.unreadCount.getData(),
      };

      utils.notifications.feed.setInfiniteData({}, (oldData) => {
        if (!oldData) {
          return {
            pages: [],
            params: [],
          };
        }
        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            notifications: page.notifications.map((notification) =>
              notification.id === id
                ? { ...notification, read: true }
                : notification,
            ),
          })),
        };
      });

      utils.notifications.unreadCount.setData(undefined, (prev) =>
        prev ? Math.max(0, prev - 1) : 0,
      );
      return { previousData };
    },
    onError: (err, {}, context) => {
      utils.notifications.feed.setData({}, context?.previousData?.feed);

      utils.notifications.unreadCount.setData(
        undefined,
        context?.previousData.unreadCount,
      );

      toast({
        title: "Cannot mark notification as read",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  return (
    <Link
      variant="ghost"
      {...linkProps}
      onClick={() =>
        notification.read === false &&
        markAsRead.mutate({ id: notification.id })
      }
    >
      <Card className="flex w-full items-center justify-between gap-2 hover:bg-neutral-50 hover:dark:bg-neutral-800">
        <div className="">
          <p className="text-neutral-800 dark:text-neutral-300">
            {notification.content}
          </p>
          <p className="text-sm text-gray-500">
            {new Date(notification.createdAt).toLocaleDateString()}
          </p>
        </div>
        {!notification.read && (
          <div className="h-2 w-2 rounded-full bg-red-500"></div>
        )}
      </Card>
    </Link>
  );
}
