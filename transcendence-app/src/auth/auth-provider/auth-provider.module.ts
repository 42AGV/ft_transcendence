import { Module } from '@nestjs/common';
import { DbModule } from '../../shared/db/db.module';
import { AuthProviderService } from './auth-provider.service';

@Module({
  imports: [DbModule],
  providers: [AuthProviderService],
  exports: [AuthProviderService],
})
export class AuthProviderModule {}
