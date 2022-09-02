import { AuthProviderType } from './auth-provider.service';

export interface AuthProviderDto {
  provider: AuthProviderType;
  providerId: string;
  userId: string;
}
