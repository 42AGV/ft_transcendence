import { INestApplicationContext } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, Socket } from 'socket.io';
import { RequestHandler } from 'express';
import * as passport from 'passport';

export class WsSessionAdapter extends IoAdapter {
  constructor(
    protected app: INestApplicationContext,
    private session: RequestHandler,
  ) {
    super(app);
  }

  createIOServer(port: number, options?: any) {
    const server: Server = super.createIOServer(port, options);

    // convert a connect middleware to a Socket.IO middleware
    const wrap =
      (middleware: any) => (socket: Socket, next: (err?: Error) => void) => {
        middleware(socket.request, {}, next);
      };
    server.use(wrap(this.session));
    server.use(wrap(passport.initialize()));
    server.use(wrap(passport.session()));

    // only allow authenticated users
    server.use(async (socket, next) => {
      const user = await socket.request.user;
      if (user) {
        next();
      } else {
        next(new Error('Forbidden'));
      }
    });
    return server;
  }
}
