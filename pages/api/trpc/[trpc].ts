import { createNextApiHandler } from '@trpc/server/adapters/next';

import { createContext } from '@/server/context';
import appRouter, { AppRouter } from '@/server/router';

// @see https://nextjs.org/docs/api-routes/introduction
export default createNextApiHandler<AppRouter>({
  router: appRouter,
  createContext,
  batching: {
    enabled: true,
  },
});
