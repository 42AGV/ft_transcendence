import { AuthProviderType } from '../../auth-provider.service';

export enum AuthProviderKeys {
  PROVIDER = '"provider"',
  PROVIDER_ID = '"providerId"',
  USER_ID = '"userId"',
}

export class AuthProviderEntity {
  constructor(
    public provider: AuthProviderType,
    public providerId: string,
    public userId: string,
  ) {}
}
