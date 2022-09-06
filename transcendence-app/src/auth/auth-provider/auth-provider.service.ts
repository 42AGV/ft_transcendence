import { Injectable } from '@nestjs/common';
import { AuthProviderDto } from './auth-provider.dto';
import { AuthProvider } from './auth-provider.domain';
import { IAuthProviderRepository } from './infrastructure/db/auth-provider.repository';

export enum AuthProviderType {
  FortyTwo = '42',
}

@Injectable()
export class AuthProviderService {
  constructor(private authProviderRepository: IAuthProviderRepository) {}

  retrieveProvider(
    provider: AuthProviderType,
    providerId: string,
  ): Promise<AuthProvider | null> {
    return this.authProviderRepository.getByProvider(provider, providerId);
  }

  addProvider(authProviderDto: AuthProviderDto): Promise<AuthProvider | null> {
    return this.authProviderRepository.addProvider(authProviderDto);
  }
}
