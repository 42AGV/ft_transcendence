import type { Knex } from 'knex';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config({ path: `.env.${process.env.NODE_ENV}` });

const configService = new ConfigService();

const defaultSettings: Knex.Config = {
  client: 'postgresql',
  connection: {
    host: configService.get('POSTGRES_HOST'),
    port: configService.get('POSTGRES_PORT'),
    user: configService.get('POSTGRES_USER'),
    password: configService.get('POSTGRES_PASSWORD'),
    database: configService.get('POSTGRES_DB'),
  },
};

module.exports.production = {
	...defaultSettings,
	migrations: {
		loadExtensions: ['.ts'],
		extension: 'ts',
	},
	seeds: {
		loadExtensions: ['.ts'],
	},
};

module.exports.development = {
	...defaultSettings,
};

module.exports.test = {
	...defaultSettings,
};
