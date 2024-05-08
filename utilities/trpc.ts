'use client';

import { createWSClient, httpBatchLink, splitLink, wsLink } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';
import { NextPageContext } from 'next';
import SuperJSON from 'superjson';

import { WebENV } from '@/env.web';
import type { AppRouter } from '@/server/router';

const isServer = typeof window === 'undefined';

function getEndingLink(ctx: NextPageContext | undefined) {
  return httpBatchLink({
    url: `${WebENV.NEXT_PUBLIC_APP_URL}:${WebENV.NEXT_PUBLIC_APP_PORT}/api/trpc`,
    headers() {
      if (!ctx?.req?.headers) {
        return {};
      }
      // on ssr, forward client's headers to the server
      return {
        ...ctx.req.headers,
        'x-ssr': '1',
      };
    },
    fetch(url, options) {
      return fetch(url, {
        ...options,
        credentials: 'include',
      });
    },
  });
}

export const trpc = createTRPCNext<AppRouter>({
  config({ ctx }) {
    return {
      transformer: SuperJSON,
      links: isServer
        ? [getEndingLink(ctx)]
        : [
            splitLink({
              condition: (op) => op.type === 'subscription',
              true: wsLink<AppRouter>({
                client: createWSClient({
                  url: `ws://${WebENV.NEXT_PUBLIC_APP_URL.split('//')[1]}:${
                    WebENV.NEXT_PUBLIC_WS_PORT
                  }`,
                }),
              }),
              false: getEndingLink(ctx),
            }),
          ],
      /**
       * @link https://tanstack.com/query/v4/docs/react/reference/QueryClient
       */
      queryClientConfig: {
        defaultOptions: { queries: { staleTime: 60, refetchOnWindowFocus: false } },
      },
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   **/
  ssr: true,
});
