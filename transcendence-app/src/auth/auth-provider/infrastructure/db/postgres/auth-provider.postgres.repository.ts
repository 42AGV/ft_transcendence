import { Injectable } from '@nestjs/common';
import { table } from '../../../../../shared/db/models';
import { BasePostgresRepository } from '../../../../../shared/db/postgres/postgres.repository';
import { PostgresPool } from '../../../../../shared/db/postgres/postgresConnection.provider';
import { makeQuery } from '../../../../../shared/db/postgres/utils';
import { AuthProviderType } from '../../../auth-provider.service';
import { AuthProvider, AuthProviderKeys } from '../auth-provider.entity';
import { IAuthProviderRepository } from '../auth-provider.repository';

@Injectable()
export class AuthProviderPostgresRepository
  extends BasePostgresRepository<AuthProvider>
  implements IAuthProviderRepository
{
  constructor(protected pool: PostgresPool) {
    super(pool, table.AUTH_PROVIDER, AuthProvider);
  }

  async getByProvider(
    provider: AuthProviderType,
    providerId: string,
  ): Promise<AuthProvider | null> {
    const authProviders = await makeQuery<AuthProvider>(this.pool, {
      text: `SELECT *
      FROM ${this.table}
      WHERE ${AuthProviderKeys.PROVIDER} =  $1 AND ${AuthProviderKeys.PROVIDER_ID} = $2;`,
      values: [provider, providerId],
    });
    return authProviders && authProviders.length
      ? new this.ctor(authProviders[0])
      : null;
  }

  addProvider(authProvider: AuthProvider): Promise<AuthProvider | null> {
    return this.add(authProvider);
  }
}
