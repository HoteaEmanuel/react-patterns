import Navbar from "@/features/shared/components/Navbar";
import { Toaster } from "@/features/shared/components/ui/Toaster";
import { ThemeProvider } from "@/features/shared/ThemeProvider";
import { trpcQueryUtils } from "@/router";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";

export type RouterAppContext = {
  trpcQueryUtils: typeof trpcQueryUtils;
};

export const Route = createRootRouteWithContext<RouterAppContext>()({
  component: Root,
});

function Root() {
  return (
    <ThemeProvider defaultTheme="system">
      <Toaster />
      <div className="flex justify-center gap-8 pb-8">
        <Navbar />
        <div className="min-h-screen w-full max-w-2xl">
          <header className="mb-4 border-b border-neutral-200 p-4 dark:border-neutral-800">
            <p className="text-center text-xl text-neutral-500 font-bold">
              <b>
               ExperienceIt
              </b>
            </p>
          </header>

          <Outlet />
        </div>
      </div>
    </ThemeProvider>
  );
}
