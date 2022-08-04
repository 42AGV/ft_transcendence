import { Pool, QueryResult } from 'pg';
import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Query } from '../models';
import { ConfigService } from '@nestjs/config';
import { PostgresConfig } from './postgres.config.interface';

@Injectable()
export class PostgresPool implements OnModuleInit, OnModuleDestroy {
  private pool: Pool;
  private logger = new Logger(PostgresPool.name);

  constructor(private configService: ConfigService<PostgresConfig>) {
    this.pool = new Pool({
      host: this.configService.get('POSTGRES_HOST'),
      port: this.configService.get('POSTGRES_PORT'),
      database: this.configService.get('POSTGRES_DB'),
      user: this.configService.get('POSTGRES_USER'),
      password: this.configService.get('POSTGRES_PASSWORD'),
    });

    this.pool.on('error', (err: Error) => this.logger.error(err.message));
  }

  async onModuleInit() {
    try {
      await this.pool.query('SELECT 1');
    } catch (err) {
      this.logger.error(err);
    }
  }

  async onModuleDestroy() {
    await this.pool.end();
  }

  connect() {
    return this.pool.connect();
  }

  query(query: Query): Promise<QueryResult<any>> {
    return this.pool.query(query);
  }
}
