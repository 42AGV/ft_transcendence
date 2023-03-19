import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { EnvironmentVariables } from '../../src/config/env.validation';
import { PostgresPool } from '../../src/shared/db/postgres/postgresConnection.provider';
import { ILocalFileRepository } from '../../src/shared/local-file/infrastructure/db/local-file.repository';
import { LocalFilePostgresRepository } from '../../src/shared/local-file/infrastructure/db/postgres/local-file.postgres.repository';
import { LocalFileService } from '../../src/shared/local-file/local-file.service';

config({ path: `.env.${process.env.NODE_ENV}` });

export const configService = new ConfigService<EnvironmentVariables>();

export const createRandomAvatar = async () => {
  const postgresPool = new PostgresPool(configService);
  const localFileRepository: ILocalFileRepository =
    new LocalFilePostgresRepository(postgresPool);
  const localFileService = new LocalFileService(
    configService,
    localFileRepository,
  );
  const avatarDto = await localFileService.createRandomSVGFile(12, 512);
  if (!avatarDto) {
    throw new Error('Could not create a random avatar');
  }

  return { id: uuidv4(), ...avatarDto };
};

export const defaultUsernames = 'abcdefghijklmnopqrstuvwxyz'.split('');
