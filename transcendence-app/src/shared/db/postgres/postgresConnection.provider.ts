import { Pool } from 'pg';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PostgresPool {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      // this may come from config module
      user: 'postgres',
      host: 'localhost',
      database: 'ft_transcendence',
      password: 'postgres',
      port: 5432,
    });
  }

  connect() {
    return this.pool.connect();
  }

  end() {
    this.pool.end();
  }
}
