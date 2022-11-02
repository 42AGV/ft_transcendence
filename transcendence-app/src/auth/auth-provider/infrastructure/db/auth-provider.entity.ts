import { AuthProviderType } from '../../auth-provider.service';

export enum AuthProviderKeys {
  PROVIDER = '"provider"',
  PROVIDER_ID = '"providerId"',
  USER_ID = '"userId"',
}

interface AuthProviderData {
  provider: AuthProviderType;
  providerId: string;
  userId: string;
}

export class AuthProvider {
  provider: AuthProviderType;
  providerId: string;
  userId: string;

  constructor(authProviderData: AuthProviderData) {
    this.provider = authProviderData.provider;
    this.providerId = authProviderData.providerId;
    this.userId = authProviderData.userId;
  }
}
