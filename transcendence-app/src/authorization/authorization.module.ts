import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from './casl-ability.factory';
import { AuthorizationService } from './authorization.service';
import { DbModule } from '../shared/db/db.module';
import { AuthorizationController } from './authorization.controller';

@Module({
  providers: [CaslAbilityFactory, AuthorizationService],
  imports: [DbModule],
  controllers: [AuthorizationController],
  exports: [CaslAbilityFactory, AuthorizationService],
})
export class AuthorizationModule {}
