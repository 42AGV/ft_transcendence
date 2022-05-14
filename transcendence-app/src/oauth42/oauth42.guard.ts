import { BadGatewayException, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OAuth42Guard extends AuthGuard('oauth42') {
  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw new BadGatewayException();
    }
    return user;
  }
}
