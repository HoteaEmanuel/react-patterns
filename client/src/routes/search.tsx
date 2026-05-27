import * as React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  ExperienceFilterParams,
  experienceFiltersSchema,
} from "../../../shared/schema/experience";
import { trpc } from "@/router";
import ExperienceList from "@/features/experiences/components/ExperienceList";
import { InfiniteScroll } from "@/features/shared/components/InfiniteScroll";
import ExperienceFilters from "@/features/experiences/components/ExperienceFilters";

export const Route = createFileRoute("/search")({
  component: SearchPage,
  validateSearch: experienceFiltersSchema,
});

function SearchPage() {
  const search = Route.useSearch();
  console.log("SEARCH");
  console.log(search);
  const navigate = useNavigate({ from: Route.fullPath });
  const experiencesQuery = trpc.experiences.search.useInfiniteQuery(search, {
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: !!search.q,
  });

  return (
    <main className="space-y-4">
      <ExperienceFilters
        onFiltersChange={(filters: ExperienceFilterParams) => {
          navigate({ search: filters });
        }}
      />
      <InfiniteScroll
        onLoadMore={!!search.q ? experiencesQuery.fetchNextPage : undefined}
        threshold={500}
      >
        <ExperienceList
          experiences={
            experiencesQuery.data?.pages.flatMap((page) => page.experiences) ??
            []
          }
          isLoading={
            experiencesQuery.isLoading || experiencesQuery.isFetchingNextPage
          }
          noExperiencesMessage={
            !!search.q ? "No experiences found" : "Search to find experiences"
          }
        />
      </InfiniteScroll>
    </main>
  );
}
