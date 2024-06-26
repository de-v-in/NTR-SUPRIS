import { Logger } from '@saintno/needed-tools';
import { applyWSSHandler } from '@trpc/server/adapters/ws';
import http from 'node:http';
import { createHttpTerminator, type HttpTerminator } from 'http-terminator';
import next from 'next';
import type { NextServer } from 'next/dist/server/next';
import { parse } from 'node:url';
import ws from 'ws';

import { SystemENV } from '@/env.system';

import { createContext } from './server/context';
import appRouter from './server/router';
import { SupabaseInstance } from './server/services/SupabaseClient';

class NextJSApplication {
  nextApp: NextServer;
  logger: Logger;
  server?: http.Server;
  wss?: ws.Server;

  // For stopping server
  stopped = false;
  httpTerminator?: HttpTerminator;

  constructor() {
    this.logger = new Logger('NextJSApplication');
    this.nextApp = next({ dev: SystemENV.NODE_ENV !== 'production' });
    this.initAddon();
    this.initNextServer();
    this.initWebSocketServer();
    this.initServices();
  }

  private initNextServer() {
    this.logger.i('initNextServer', 'Initializing NextJS server');
    const handle = this.nextApp.getRequestHandler();
    this.nextApp.prepare().then(() => {
      this.server = http.createServer(async (req, res) => {
        if (req.url) {
          const parsedUrl = parse(req.url, true);
          await handle(req, res, parsedUrl);
        }
      });
      this.server.listen(Number(SystemENV.NEXT_PUBLIC_APP_PORT));
      this.logger.i(
        'initNextServer',
        `Server listening at ${SystemENV.NEXT_PUBLIC_APP_URL}:${SystemENV.NEXT_PUBLIC_APP_PORT} as ${SystemENV.NODE_ENV}`
      );
      this.httpTerminator = createHttpTerminator({ server: this.server });
    });
  }

  private initWebSocketServer() {
    this.wss = new ws.Server({
      port: Number(SystemENV.NEXT_PUBLIC_WS_PORT),
    });
    applyWSSHandler({
      wss: this.wss,
      router: appRouter,
      createContext: createContext,
    });
    this.wss.on('connection', (ws) => {
      this.logger.i('Websocket', 'New connection', {
        size: this.wss?.clients.size,
      });
      ws.once('close', () => {
        this.logger.i('Websocket', 'Connection closed', {
          size: this.wss?.clients.size,
        });
      });
    });
    this.logger.i(
      'initWebSocketServer',
      `WebSocket Server listening at ws://${SystemENV.NEXT_PUBLIC_APP_URL.split('//')[1]}:${
        SystemENV.NEXT_PUBLIC_WS_PORT
      }`
    );
  }

  private initServices() {
    SupabaseInstance.getInstance();
  }

  /**
   * Initialize addon feature to be used on application
   */
  private initAddon() {
    const addon = SystemENV.FEATURE_FLAGS.split(',');
    for (const name of addon) {
      switch (name) {
        case 'heapdump':
          return;
      }
    }
  }
}

new NextJSApplication();
