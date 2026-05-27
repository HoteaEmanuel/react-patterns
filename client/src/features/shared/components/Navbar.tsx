import { Home } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import Link from "./ui/Link";

export default function Navigation() {
  const activeLinkClassName = "bg-neutral-100 dark:bg-neutral-900";

  const navLinkClassName =
    "rounded-lg p-2 text-lg hover:bg-neutral-100 dark:bg-neutral-800 flex justify-center";
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
      <ThemeToggle />
    </nav>
  );
}
