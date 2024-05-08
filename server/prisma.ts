/**
 * Instantiates a single instance PrismaClient and save it on the global object.
 * @link https://www.prisma.io/docs/support/help-articles/nextjs-prisma-client-dev-practices
 */
import { PrismaClient } from '@prisma/client';
import { Logger } from '@saintno/needed-tools';
import { createPrismaRedisCache } from 'prisma-redis-middleware';

import { SystemENV } from '@/env.system';

const prismaGlobal = global as typeof global & {
  prisma?: PrismaClient;
};
export class Prisma {
  private static instance: Prisma;
  logger: Logger;
  client: PrismaClient;

  private constructor() {
    this.logger = new Logger('Prisma');
    if (!prismaGlobal.prisma) {
      prismaGlobal.prisma = new PrismaClient({
        log:
          SystemENV.NODE_ENV === 'development'
            ? ['query', 'error', 'warn'].map((level: TAny) => ({
                emit: 'event',
                level,
              }))
            : [{ emit: 'event', level: 'error' }],
      });
      prismaGlobal.prisma.$on('query' as never, (e: TAny) => {
        this.logger.i('query', 'Start query data', { query: e.query, duration: e.duration });
      });
      prismaGlobal.prisma.$on('warn' as never, (e: TAny) => {
        this.logger.i('warn', 'Warning while querying data', {
          query: e.query,
          duration: e.duration,
        });
      });
      prismaGlobal.prisma.$on('error' as never, (e: TAny) => {
        this.logger.i('error', 'Query data failed', { query: e.query, duration: e.duration });
      });
    }
    this.client = prismaGlobal.prisma;
    this.initCache();
  }

  static getInstance(): Prisma {
    if (!Prisma.instance) {
      Prisma.instance = new Prisma();
    }
    return Prisma.instance;
  }

  private initCache() {
    const cacheMiddleware = createPrismaRedisCache({
      models: [
        { model: 'Task', invalidateRelated: ['TaskResource', 'RenderConfiguration'] },
        { model: 'TaskResource', invalidateRelated: ['Task', 'RenderConfiguration'] },
        { model: 'Resource', invalidateRelated: ['TaskResource'] },
        { model: 'Model' },
        { model: 'RenderConfiguration' },
      ],
      storage: { type: 'memory', options: { size: 4096, invalidation: true } },
      onHit: (key) => {
        this.logger.i('prismaCache', 'Cache hit', { key });
      },
      cacheTime: 600,
    });
    this.client.$use(cacheMiddleware);
  }

  get User() {
    return this.client.user;
  }
}
