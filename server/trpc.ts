import { initTRPC, TRPCError } from '@trpc/server';
import SuperJSON from 'superjson';

import { Context } from './context';

const t = initTRPC.context<Context>().create({
  transformer: SuperJSON,
});

/**
 * Unprotected procedure
 **/
export const publicProcedure = t.procedure;

export const router = t.router;
export const middleware = t.middleware;
export const mergeRouters = t.mergeRouters;

const authChecker = middleware(({ next, ctx }) => {
  const user = ctx.session?.user;

  if (!user?.email) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  return next();
});

const adminChecker = middleware(({ next, ctx }) => {
  const user = ctx.session?.user;

  if (!user?.email) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  if (user.type !== 'ADMIN') {
    throw new TRPCError({ code: 'FORBIDDEN' });
  }

  return next();
});

/**
 * Protected base procedure
 */
export const privateProcedure = t.procedure.use(authChecker);

/**
 * Protected admin procedure
 */
export const adminProcedure = t.procedure.use(adminChecker);
