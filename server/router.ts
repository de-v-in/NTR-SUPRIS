import { PublicRouter } from './routers/app';
import { UserRouter } from './routers/user';
import { router } from './trpc';

const appRouter = router({
  public: PublicRouter,
  user: UserRouter,
});

export type AppRouter = typeof appRouter;

export default appRouter;
