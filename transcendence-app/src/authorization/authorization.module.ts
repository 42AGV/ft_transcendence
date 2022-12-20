import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from './casl-ability.factory';
import { AuthorizationService } from './authorization.service';
import { DbModule } from '../shared/db/db.module';

@Module({
  providers: [CaslAbilityFactory, AuthorizationService],
  imports: [DbModule],
  exports: [CaslAbilityFactory, AuthorizationService],
})
export class AuthorizationModule {}
