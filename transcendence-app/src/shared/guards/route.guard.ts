import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';

interface IRequest extends Request {
  session: any;
}
@Injectable()
export class RouteGuard implements CanActivate {
  constructor() {}
  canActivate(context: ExecutionContext): boolean {
    const req: IRequest = context.switchToHttp().getRequest();
    return req.session.authenticated;
  }
}
