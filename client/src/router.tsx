import { env } from "./lib/utils/env";
import { AppRouter } from "@advanced-react/server";
import {
  createTRPCQueryUtils,
  createTRPCReact,
  httpBatchLink,
  TRPCClientError,
} from "@trpc/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import Spinner from "./features/shared/components/ui/Spinner";
import { routeTree } from "./routeTree.gen";
import ErrorComponent from "./features/shared/components/ErrorComponent";
import NotFoundComponent from "./features/shared/components/NotFoundComponent";
export const trpc = createTRPCReact<AppRouter>();

export const queryClient = new QueryClient();

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: env.VITE_SERVER_BASE_URL,

      // You can pass any HTTP headers you wish here
      // async headers() {
      //   return {
      //     authorization: getAuthCookie(),
      //   };
      // },
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
