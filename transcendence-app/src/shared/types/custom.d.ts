import { User } from '../../user/user.domain';

declare module 'http' {
  interface IncomingMessage {
    user: User;
  }
}
