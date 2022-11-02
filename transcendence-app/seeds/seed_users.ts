import { Knex } from 'knex';
import { faker } from '@faker-js/faker';
import { rmSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { LocalFileService } from '../src/shared/local-file/local-file.service';
import { EnvironmentVariables } from '../src/config/env.validation';
import { ILocalFileRepository } from '../src/shared/local-file/infrastructure/db/local-file.repository';
import { LocalFilePostgresRepository } from '../src/shared/local-file/infrastructure/db/postgres/local-file.postgres.repository';
import { PostgresPool } from '../src/shared/db/postgres/postgresConnection.provider';

config({ path: `.env.${process.env.NODE_ENV}` });

const configService = new ConfigService<EnvironmentVariables>();
const USERS_NUMBER = 5000;

const createRandomAvatar = async () => {
  const postgresPool = new PostgresPool(configService);
  const localFileRepository: ILocalFileRepository =
    new LocalFilePostgresRepository(postgresPool);
  const localFileService = new LocalFileService(
    configService,
    localFileRepository,
  );
  const avatarDto = await localFileService.createRandomSVGFile(12, 512);

  return { id: uuidv4(), ...avatarDto };
};

const createRandomUser = (avatarId: string) => {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const username = faker.helpers.unique(faker.internet.userName, [
    firstName,
    lastName,
  ]);
  return {
    username: username.slice(-20),
    email: faker.internet.email(firstName, lastName).slice(-50),
    fullName: faker.name.fullName({ firstName, lastName }),
    avatarId,
  };
};

export async function seed(knex: Knex): Promise<void> {
  // Save avatar data to delete later
  const avatarsData = await knex
    .select('localfile.id', 'localfile.path')
    .from('users')
    .innerJoin('localfile', 'users.avatarId', 'localfile.id');
  // Deletes ALL existing entries and local files
  await knex('users').del();
  for (let i = 0; i < avatarsData.length; i++) {
    await knex('localfile').where('id', avatarsData[i].id).del();
    rmSync(avatarsData[i].path, {
      recursive: true,
      force: true,
    });
  }

  const avatars = await Promise.all(
    Array.from({ length: USERS_NUMBER }, createRandomAvatar),
  );
  const users = avatars.map((avatar) => createRandomUser(avatar.id));

  // Inserts seed entries
  await knex('localfile').insert(avatars);
  await knex('users').insert(users);
}
