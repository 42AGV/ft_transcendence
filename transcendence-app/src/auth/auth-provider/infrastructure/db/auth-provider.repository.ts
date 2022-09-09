import { AuthProviderType } from '../../auth-provider.service';
import { AuthProvider } from '../../auth-provider.domain';

export abstract class IAuthProviderRepository {
  abstract getByProvider(
    provider: AuthProviderType,
    providerId: string,
  ): Promise<AuthProvider | null>;
  abstract addProvider(
    authProvider: AuthProvider,
  ): Promise<AuthProvider | null>;
}
