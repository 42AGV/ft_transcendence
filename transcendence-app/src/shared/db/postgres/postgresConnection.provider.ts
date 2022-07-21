import { Pool, QueryResult } from 'pg';
import { Injectable } from '@nestjs/common';
import { Query } from '../models';

@Injectable()
export class PostgresPool {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      // TODO - #52 Create logs and tests and read from config in db repository
      user: 'postgres',
      host: 'db',
      database: 'ft_transcendence',
      password: 'postgres',
      port: 5432,
    });
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
