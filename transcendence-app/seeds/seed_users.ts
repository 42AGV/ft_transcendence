import { Knex } from 'knex';
import { faker } from '@faker-js/faker';
import { randomBytes } from 'crypto';
import { join } from 'path';
import { createWriteStream, mkdir, rmSync } from 'fs';
import { LocalFileDto } from '../src/shared/local-file/local-file.dto';
import generateAvatar = require('github-like-avatar-generator');
import { AVATARS_PATH } from '../src/user/constants';
import { v4 as uuidv4 } from 'uuid';

const USERS_NUMBER = 5000;

function createDirectory(directory: string) {
  return mkdir(directory, { recursive: true }, (err) => {
    if (err) {
      throw err;
    }
  });
}

function createWriteOutStream(path: string, mimetype: string) {
  const filesPath = process.env.TRANSCENDENCE_APP_DATA as string;
  const filename = randomBytes(16).toString('hex');
  const directory = join(filesPath, path);
  createDirectory(directory);
  const finalPath = join(directory, filename);
  const outStream = createWriteStream(finalPath);

  return {
    outStream,
    outStreamPromise: new Promise<LocalFileDto>((resolve, reject) => {
      outStream.on('finish', () =>
        resolve({
          filename,
          mimetype,
          path: finalPath,
          size: outStream.bytesWritten,
        }),
      );
      outStream.on('error', reject);
    }),
  };
}

function saveFileDataFromBuffer(
  data: Buffer,
  path: string,
  mimetype: string,
): Promise<LocalFileDto> {
  const { outStream, outStreamPromise } = createWriteOutStream(path, mimetype);

  outStream.write(data);
  outStream.end();

  return outStreamPromise;
}

// default values as suggested in lib example
function createRandomSVGFile(blocks = 6, width = 100) {
  const newAvatar = generateAvatar({
    blocks: blocks,
    width: width,
  });

  const prefix = 'data:image/svg+xml;base64,';
  const base64Encoded = newAvatar.base64.slice(prefix.length);
  const buff = Buffer.from(base64Encoded, 'base64');
  return saveFileDataFromBuffer(buff, AVATARS_PATH, 'image/svg+xml');
}

const createRandomAvatar = async (knex: Knex) => {
  const avatarDto = await createRandomSVGFile(12, 512);
  const id = uuidv4();
  await knex('localfile').insert({ id: id, ...avatarDto });
  return id;
};

const createRandomUser = () => {
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
  };
};

async function createRandomUserAndAvatar(knex: Knex) {
  const avatarId = await createRandomAvatar(knex);
  const randomUser = createRandomUser();
  return { ...randomUser, avatarId };
}

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('users').del();
  // Deletes ALL existing entries
  await knex('localfile').del();
  const avatarsDir = join(
    process.env.TRANSCENDENCE_APP_DATA as string,
    AVATARS_PATH,
  );
  rmSync(avatarsDir, { recursive: true, force: true });

  const users: any[] = [];

  for (let i = 0; i < USERS_NUMBER; i++) {
    const randomUser = await createRandomUserAndAvatar(knex);
    users.push(randomUser);
  }

  // Inserts seed entries
  await knex('users').insert(users);
}
