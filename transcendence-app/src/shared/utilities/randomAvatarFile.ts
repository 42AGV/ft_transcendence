import generateAvatar = require('github-like-avatar-generator');
import { createWriteStream, mkdir } from 'fs';
import { randomBytes } from 'crypto';
import { join } from 'path';

import { AVATARS_PATH } from '../../user/constants';
import { LocalFileDto } from '../local-file/local-file.dto';

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
export default function createRandomAvatarFile(
  blocks = 6,
  width = 100,
): Promise<LocalFileDto> {
  const newAvatar = generateAvatar({
    blocks: blocks,
    width: width,
  });

  const prefix = 'data:image/svg+xml;base64,';
  const base64Encoded = newAvatar.base64.slice(prefix.length);
  const buff = Buffer.from(base64Encoded, 'base64');
  return saveFileDataFromBuffer(buff, AVATARS_PATH, 'image/svg+xml');
}
