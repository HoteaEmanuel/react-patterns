import Navbar from "./features/shared/components/Navbar";
import { Toaster } from "./features/shared/components/ui/Toaster";
import { ThemeProvider } from "./features/shared/ThemeProvider";
import "leaflet/dist/leaflet.css";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ExperienceList from "./features/experiences/components/ExperienceList";
import { InfiniteScroll } from "./features/shared/components/InfiniteScroll";
import { trpc, trpcClient } from "./router";
import { ExperienceForList } from "./features/experiences/types";
export function App() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="system">
          <Toaster />
          <div className="flex flex-col justify-center gap-8 overflow-y-hidden border-2 border-blue-500 pb-8">
            <Navbar />
            <div className="min-h-screen w-full max-w-2xl">
              <Index />
            </div>
          </div>
        </ThemeProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

function Index() {
  const experiencesQuery = trpc.experiences.feed.useInfiniteQuery(
    {},
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );
  return (
    <InfiniteScroll onLoadMore={experiencesQuery.fetchNextPage} threshold={500}>
      <ExperienceList
        experiences={
          (experiencesQuery.data?.pages.flatMap(
            (page) => page.experiences,
          ) as ExperienceForList[]) ?? []
        }
        isLoading={
          experiencesQuery.isLoading || experiencesQuery.isFetchingNextPage
        }
      />
    </InfiniteScroll>
  );
}
