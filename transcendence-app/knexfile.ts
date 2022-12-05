import type { Knex } from 'knex';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config({ path: `.env.${process.env.NODE_ENV}` });

const configService = new ConfigService();

const defaultConfig: Knex.Config = {
  client: 'postgresql',
  connection: {
    host: configService.get('POSTGRES_HOST'),
    port: configService.get('POSTGRES_PORT'),
    user: configService.get('POSTGRES_USER'),
    password: configService.get('POSTGRES_PASSWORD'),
    database: configService.get('POSTGRES_DB'),
  },
};

module.exports = {
  development: {
    ...defaultConfig,
    migrations: {
      loadExtensions: ['.ts'],
    },
  },
  test: {
    ...defaultConfig,
    migrations: {
      loadExtensions: ['.ts'],
    },
  },
  production: {
    ...defaultConfig,
    migrations: {
      loadExtensions: ['.js'],
    },
  },
};
