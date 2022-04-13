import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `Hello ${process.env.TRANSCENDENCE_APP_NAME}!`;
  }
}
