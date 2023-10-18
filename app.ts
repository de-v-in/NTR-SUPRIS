import { Logger } from '@saintno/needed-tools';
import { applyWSSHandler } from '@trpc/server/adapters/ws';
import http from 'http';
import { createHttpTerminator, HttpTerminator } from 'http-terminator';
import next from 'next';
import { NextServer } from 'next/dist/server/next';
import { parse } from 'url';
import ws from 'ws';

import { SystemENV } from '@/env';

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
        const parsedUrl = parse(req.url!, true);
        await handle(req, res, parsedUrl);
      });
      this.server.listen(Number(SystemENV.APP_PORT));
      this.logger.i(
        'initNextServer',
        `Server listening at ${SystemENV.APP_URL}:${SystemENV.APP_PORT} as ${SystemENV.NODE_ENV}`
      );
      this.httpTerminator = createHttpTerminator({ server: this.server });
    });
  }

  private initWebSocketServer() {
    this.wss = new ws.Server({
      port: Number(SystemENV.WS_PORT),
    });
    applyWSSHandler({
      wss: this.wss,
      router: appRouter,
      createContext: createContext,
    });
    this.wss.on('connection', (ws) => {
      this.logger.i('Websocket', `New connection`, { size: this.wss?.clients.size });
      ws.once('close', () => {
        this.logger.i('Websocket', `Connection closed`, { size: this.wss?.clients.size });
      });
    });
    this.logger.i(
      'initWebSocketServer',
      `WebSocket Server listening at ws://${SystemENV.APP_URL.split('//')[1]}:3001`
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
    addon.forEach((name) => {
      switch (name) {
        case 'heapdump':
          return;
      }
    });
  }
}

new NextJSApplication();
