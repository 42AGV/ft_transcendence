import { Pool, QueryResult } from 'pg';
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Query } from '../models';
import { ConfigService } from '@nestjs/config';
import { PostgresConfig } from './postgres.config.interface';

@Injectable()
export class PostgresPool implements OnModuleDestroy {
  private pool: Pool;

  constructor(private configService: ConfigService<PostgresConfig>) {
    this.pool = new Pool({
      host: this.configService.get('POSTGRES_HOST'),
      port: this.configService.get('POSTGRES_PORT'),
      database: this.configService.get('POSTGRES_DB'),
      user: this.configService.get('POSTGRES_USER'),
      password: this.configService.get('POSTGRES_PASSWORD'),
    });
  }

  async onModuleDestroy() {
    this.pool.end();
  }

  connect() {
    return this.pool.connect();
  }

  query(query: Query): Promise<QueryResult<any>> {
    return this.pool.query(query);
  }

  end() {
    this.pool.end();
  }
}
