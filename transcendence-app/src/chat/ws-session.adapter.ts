import { INestApplicationContext } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, Socket } from 'socket.io';
import * as express from 'express';
import * as passport from 'passport';
import { User } from '../user/user.domain';

// TODO: Move this module declaration to another file
declare module 'http' {
  interface IncomingMessage {
    user: User;
  }
}

export class WsSessionAdapter extends IoAdapter {
  constructor(
    protected app: INestApplicationContext,
    private session: express.RequestHandler,
  ) {
    super(app);
  }

  createIOServer(port: number, options?: any) {
    const server: Server = super.createIOServer(port, options);
    const wrap =
      (middleware: any) => (socket: Socket, next: (err?: Error) => void) => {
        middleware(socket.request, {}, next);
      };

    server.use(wrap(this.session));
    server.use(wrap(passport.initialize()));
    server.use(wrap(passport.session()));
    server.use((socket, next) => {
      if (socket.request.user) {
        next();
      } else {
        next(new Error('Forbidden'));
      }
    });
    return server;
  }
}
