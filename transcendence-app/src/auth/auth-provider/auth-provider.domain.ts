import { AuthProviderType } from './auth-provider.service';

export class AuthProvider {
  constructor(
    public provider: AuthProviderType,
    public providerId: string,
    public userId: string,
  ) {}
}
