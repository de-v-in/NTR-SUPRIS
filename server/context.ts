import { EUserType } from '@prisma/client';
import type * as trpc from '@trpc/server';
import type * as trpcNext from '@trpc/server/adapters/next';
import type { NodeHTTPCreateContextFnOptions } from '@trpc/server/adapters/node-http';
import type { IncomingMessage } from 'node:http';
import { UAParser } from 'ua-parser-js';
import type ws from 'ws';

import { ServerLog } from './common';
import { UserManager } from './common/UserManager';

const uaParser = new UAParser();

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export const createContext = async (
  opts: trpcNext.CreateNextContextOptions | NodeHTTPCreateContextFnOptions<IncomingMessage, ws>
) => {
  const start = performance.now();
  const user = await UserManager.getInstance().getUser(opts.req.headers.cookie);
  if (user) {
    ServerLog.i('createContext', `Incoming request from user ${user?.email ?? 'unknown'}`, {
      take: performance.now() - start,
    });
  } else {
    uaParser.setUA(opts.req.headers['user-agent'] ?? '');
    ServerLog.i('createContext', 'Incoming request from guest', {
      browser: uaParser.getBrowser(),
      device: uaParser.getDevice(),
      engine: uaParser.getEngine(),
      os: uaParser.getOS(),
    });
  }
  return {
    token: opts.req.headers.cookie,
    session: { user: { ...user } },
  };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
