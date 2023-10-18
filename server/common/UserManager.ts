import { EUserType } from '@prisma/client';
import { createClient, RedisClientType } from 'redis';

import { Prisma } from '../prisma';
import { SupabaseInstance } from '../services/SupabaseClient';

const userManagerGlobal = global as typeof global & {
  userManager?: UserManager;
};

export class UserManager {
  prisma: Prisma;
  redis: RedisClientType;

  private constructor() {
    this.prisma = Prisma.getInstance();
    this.redis = createClient();
  }

  public static getInstance(): UserManager {
    if (!userManagerGlobal.userManager) {
      userManagerGlobal.userManager = new UserManager();
    }
    return userManagerGlobal.userManager;
  }

  async getUser(cookie?: string) {
    if (!cookie) return null;
    const supabaseUser = await SupabaseInstance.getInstance().getUserByCookie(cookie);
    if (supabaseUser) {
      const userType = await this.prisma.User.findUnique({
        where: { email: supabaseUser.email },
      }).then((user) => user?.type ?? EUserType.L0);
      const user = { ...supabaseUser, type: userType };
      return user;
    }
    return null;
  }

  async delUser(cookie?: string) {
    if (!cookie) return;
  }
}
