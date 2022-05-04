import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { UsersModule } from '../../users/users.module';
import { FortyTwoController } from './fortytwo.controller';
import { FortyTwoStrategy } from './fortytwo.strategy';

@Module({
  imports: [HttpModule, UsersModule],
  controllers: [FortyTwoController],
  providers: [FortyTwoStrategy],
})
export class FortyTwoModule {}
