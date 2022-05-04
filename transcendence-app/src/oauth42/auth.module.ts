import { Module } from '@nestjs/common';
import { FortyTwoModule } from './fortytwo/fortytwo.module';

@Module({
  imports: [FortyTwoModule],
})
export class AuthModule {}
