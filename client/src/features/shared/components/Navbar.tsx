import { Home, Search, Settings, User } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import Link from "./ui/Link";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";

export default function Navigation() {
  const { currentUser } = useCurrentUser();
  const activeLinkClassName = "bg-neutral-100 dark:bg-neutral-950";

  const navLinkClassName =
    "rounded-lg p-2 hover:bg-neutral-200 hover:dark:bg-neutral-900 text-lg  flex justify-center";
  return (
    <nav className="flex w-64 flex-col gap-4 pt-8">
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
        <Link
          to="/login"
          variant={"ghost"}
          className={navLinkClassName}
          activeProps={{ className: activeLinkClassName }}
        >
          <User className="size-5" />
          Sign in
        </Link>
      )}
      {currentUser && (
        <Link
          to="/settings"
          variant={"ghost"}
          className={navLinkClassName}
          activeProps={{ className: activeLinkClassName }}
        >
          <Settings className="size-5" />
          Settings
        </Link>
      )}
      <ThemeToggle />
    </nav>
  );
}
