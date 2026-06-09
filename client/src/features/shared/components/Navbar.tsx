import {
  AlarmClockIcon,
  Bell,
  Edit,
  Heart,
  Home,
  Search,
  Settings,
  User,
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import Link from "./ui/Link";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { trpc } from "@/router";
import { cn } from "@/lib/utils/cn";
import { Button } from "./ui/Button";

export default function Navigation() {
  const { currentUser } = useCurrentUser();
  const activeLinkClassName = "bg-neutral-100 dark:bg-neutral-950";

  const navLinkClassName =
    "rounded-lg p-2 hover:bg-neutral-200 hover:dark:bg-neutral-900 text-lg  flex";

  const unreadCountQuery = trpc.notifications.unreadCount.useQuery(undefined, {
    enabled: !!currentUser,
  });



  const unreadCount = Number(unreadCountQuery.data ?? 0);
  return (
    <nav className="sticky flex h-screen w-64 flex-col gap-4 pt-8">
      <Link
        to="/"
        variant="ghost"
        className={navLinkClassName}
        activeProps={{ className: activeLinkClassName }}
      >
        <Home className="size-6" />
        Home
      </Link>

      <Link
        to="/search"
        variant={"ghost"}
        className={navLinkClassName}
        activeProps={{ className: activeLinkClassName }}
      >
        <Search className="size-5" />
        Search
      </Link>
      {!currentUser && (
        <>
          <Link
            to="/login"
            variant={"ghost"}
            className={navLinkClassName}
            activeProps={{ className: activeLinkClassName }}
          >
            <User className="size-5" />
            Sign in
          </Link>

          <Link
            to="/register"
            variant={"ghost"}
            className={navLinkClassName}
            activeProps={{ className: activeLinkClassName }}
          >
            <User className="size-5" />
            Sign up
          </Link>
        </>
      )}
      {currentUser && (
        <>
          <Link
            to="/notifications"
            variant="ghost"
            className={cn(
              navLinkClassName,
              "relative flex items-center justify-between gap-2",
            )}
            activeProps={{ className: activeLinkClassName }}
          >
            <div className="flex items-center gap-2">
              <Bell className="size-5" />
              Notifications
            </div>
              {unreadCount > 0 && (
                <div className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs text-white">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </div>
              )}
          </Link>

          <Link
            to="/favorites"
            variant="ghost"
            className={navLinkClassName}
            activeProps={{ className: activeLinkClassName }}
          >
            <Heart className="size-5" />
            Favorites
          </Link>
          <Link
            to="/users/$userId"
            params={{ userId: currentUser.id }}
            variant={"ghost"}
            className={navLinkClassName}
            activeProps={{ className: activeLinkClassName }}
          >
            <User className="size-5" />
            Profile
          </Link>

          <Link
            to="/settings"
            variant={"ghost"}
            className={navLinkClassName}
            activeProps={{ className: activeLinkClassName }}
          >
            <Settings className="size-5" />
            Settings
          </Link>
        </>
      )}
      <ThemeToggle />
      {currentUser && (
        <Button asChild>
          <Link to="/experiences/new" variant="ghost" className="w-full">
            <Edit className="size-5" />
            Create Experience
          </Link>
        </Button>
      )}
    </nav>
  );
}
