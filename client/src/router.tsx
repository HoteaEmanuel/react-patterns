import { env } from "./lib/utils/env";
import { AppRouter } from "@advanced-react/server";
import {
  createTRPCQueryUtils,
  createTRPCReact,
  getQueryKey,
  httpBatchLink,
  TRPCClientError,
  TRPCLink,
} from "@trpc/react-query";
import { observable } from "@trpc/server/observable";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createRouter as createTanStackRouter,
  linkOptions,
} from "@tanstack/react-router";
import Spinner from "./features/shared/components/ui/Spinner";
import { routeTree } from "./routeTree.gen";
import ErrorComponent from "./features/shared/components/ErrorComponent";
import NotFoundComponent from "./features/shared/components/NotFoundComponent";
export const trpc = createTRPCReact<AppRouter>();

export const queryClient = new QueryClient();

export function getHeaders() {
  const queryKey = getQueryKey(trpc.auth.currentUser);
  const token = queryClient.getQueryData<{ accessToken: string }>(
    queryKey,
  )?.accessToken;

  return {
    Authorization: token ? `Bearer ${token}` : undefined,
  };
}

export const customLink: TRPCLink<AppRouter> = () => {
  return ({ next, op }) => {
    return observable((observer) => {
      const unsubscribe = next(op).subscribe({
        next(value) {
          observer.next(value);
        },
        error(err) {
          if (err.data?.code === "UNAUTHORIZED") {
            router.navigate({ to: "/login" });
          }
          observer.error(err);
        },
        complete() {
          observer.complete();
        },
      });

      return unsubscribe;
    });
  };
};

export const trpcClient = trpc.createClient({
  links: [
    customLink,

    httpBatchLink({
      url: env.VITE_SERVER_BASE_URL,
      headers: getHeaders, // tRPC calls this function on every request
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: "include",
        });
      },
    }),
  ],
});

export const trpcQueryUtils = createTRPCQueryUtils({
  queryClient: queryClient,
  client: trpcClient,
});

export function createRouter() {
  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: "intent",
    context: {
      trpcQueryUtils,
    },
    defaultPendingComponent: () => (
      <div className={`flex justify-center p-2 text-2xl`}>
        <Spinner />
      </div>
    ),
    defaultErrorComponent: ErrorComponent,
    defaultNotFoundComponent: NotFoundComponent,

    Wrap: function WrapComponent({ children }) {
      return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </trpc.Provider>
      );
    },
  });

  return router;
}

export const router = createRouter();

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}

export function isTRPCClientError(
  cause: unknown,
): cause is TRPCClientError<AppRouter> {
  return cause instanceof TRPCClientError;
}
