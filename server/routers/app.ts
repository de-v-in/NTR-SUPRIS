import { observable } from '@trpc/server/observable';

import { publicProcedure, router } from '../trpc';

export const PublicRouter = router({
  ping: publicProcedure.subscription(() => {
    return observable<number>((emit) => {
      let i = 0;
      const interval = setInterval(() => {
        emit.next(i * 1);
        i++;
      }, 1000);
      return () => {
        clearInterval(interval);
      };
    });
  }),
});