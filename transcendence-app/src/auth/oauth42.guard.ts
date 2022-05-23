import {
  BadGatewayException,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OAuth42Guard extends AuthGuard('oauth42') {
  async canActivate(context: ExecutionContext) {
    const result = (await super.canActivate(context)) as boolean;
    const request = context.switchToHttp().getRequest();
    await super.logIn(request);
    return result;
  }

  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw new BadGatewayException();
    }
    return user;
  }
}
