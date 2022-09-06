import { Injectable } from '@nestjs/common';
import { table } from '../../../../../shared/db/models';
import { BasePostgresRepository } from '../../../../../shared/db/postgres/postgres.repository';
import { PostgresPool } from '../../../../../shared/db/postgres/postgresConnection.provider';
import { makeQuery } from '../../../../../shared/db/postgres/utils';
import { AuthProviderType } from '../../../auth-provider.service';
import { AuthProviderEntity, AuthProviderKeys } from '../auth-provider.entity';
import { IAuthProviderRepository } from '../auth-provider.repository';

@Injectable()
export class AuthProviderPostgresRepository
  extends BasePostgresRepository<AuthProviderEntity>
  implements IAuthProviderRepository
{
  constructor(protected pool: PostgresPool) {
    super(pool, table.AUTH_PROVIDER);
  }

  async getByProvider(
    provider: AuthProviderType,
    providerId: string,
  ): Promise<AuthProviderEntity | null> {
    const authProviders = await makeQuery<AuthProviderEntity>(this.pool, {
      text: `SELECT *
      FROM ${this.table}
      WHERE ${AuthProviderKeys.PROVIDER} =  $1 AND ${AuthProviderKeys.PROVIDER_ID} = $2;`,
      values: [provider, providerId],
    });
    return authProviders && authProviders.length ? authProviders[0] : null;
  }

  addProvider(
    authProvider: AuthProviderEntity,
  ): Promise<AuthProviderEntity | null> {
    return this.add(authProvider);
  }
}
