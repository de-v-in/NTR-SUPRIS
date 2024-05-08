import { z } from 'zod';

import { UserManager } from '../common/UserManager';
import { Prisma } from '../prisma';
import { privateProcedure, router } from '../trpc';

const prisma = Prisma.getInstance();

export const UserRouter = router({
  login: privateProcedure.mutation(() => {
    return true;
  }),
  logout: privateProcedure.mutation((opts) => {
    UserManager.getInstance().delUser(opts.ctx.token);
    return true;
  }),
  auth: privateProcedure
    .input(
      z.object({
        email: z.string(),
        id: z.string(),
        name: z.string().optional(),
        avatar: z.string().optional(),
      })
    )
    .mutation(async (opts) => {
      const user = await prisma.User.findFirst({
        where: { email: opts.input.email },
        select: {
          avatar: true,
          id: true,
          name: true,
          email: true,
        },
      });
      if (!user) {
        const args: TAny[] = [];
        args.push(
          prisma.User.create({
            data: {
              email: opts.input.email,
              id: opts.input.id,
              name: opts.input.name,
            },
          })
        );
        const [avatar, newUser] = await prisma.client.$transaction(args);
        return { ...newUser, avatar } as typeof user;
      }
      return user;
    }),
  self: privateProcedure.query(async (opts) => {
    const user = await prisma.User.findFirst({
      where: { id: opts.ctx.session.user.id },
    });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }),
});
