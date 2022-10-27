import { Injectable, Logger } from '@nestjs/common';
import { LocalFileDto } from './local-file.dto';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';
import { join } from 'path';
import { createWriteStream, mkdir, ReadStream, unlink } from 'fs';
import { LocalFileConfig } from './local-file.config.interface';
import { LocalFile } from './local-file.domain';
import { ILocalFileRepository } from './infrastructure/db/local-file.repository';
import generateAvatar = require('github-like-avatar-generator');
import { AVATARS_PATH } from '../constants';

@Injectable()
export class LocalFileService {
  private readonly logger = new Logger(LocalFileService.name);

  constructor(
    private configService: ConfigService<LocalFileConfig>,
    private localFileRepository: ILocalFileRepository,
  ) {}

  private createDirectory(directory: string) {
    return mkdir(directory, { recursive: true }, (err) => {
      if (err) {
        this.logger.error(err.message);
        throw err;
      }
    });
  }

  private createWriteOutStream(path: string, mimetype: string) {
    const filesPath = this.configService.get(
      'TRANSCENDENCE_APP_DATA',
    ) as string;
    const filename = randomBytes(16).toString('hex');
    const directory = join(filesPath, path);
    this.createDirectory(directory);
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

  async saveFileDataFromStream(
    data: ReadStream,
    path: string,
    mimetype: string,
  ): Promise<LocalFileDto> {
    const { outStream, outStreamPromise } = this.createWriteOutStream(
      path,
      mimetype,
    );

    data.pipe(outStream);

    return outStreamPromise;
  }

  async saveFileDataFromBuffer(
    data: Buffer,
    path: string,
    mimetype: string,
  ): Promise<LocalFileDto> {
    const { outStream, outStreamPromise } = this.createWriteOutStream(
      path,
      mimetype,
    );

    outStream.write(data);
    outStream.end();

    return outStreamPromise;
  }

  deleteFileData(path: string): void {
    unlink(path, (err) => {
      if (err) {
        this.logger.error(err.message);
      }
    });
  }

  deleteFileById(id: string): Promise<LocalFile | null> {
    return this.localFileRepository.deleteById(id);
  }

  getFileById(id: string): Promise<LocalFile | null> {
    return this.localFileRepository.getById(id);
  }

  updateFileById(
    id: string,
    localFileDto: Partial<LocalFileDto>,
  ): Promise<LocalFile | null> {
    return this.localFileRepository.updateById(id, localFileDto);
  }

  // default values as suggested in lib example
  async createRandomSVGFile(blocks = 6, width = 100) {
    const newAvatar: GenerateAvatarReturnType = generateAvatar({
      blocks: blocks,
      width: width,
    });

    const prefix = 'data:image/svg+xml;base64,';
    const base64Encoded = newAvatar.base64.slice(prefix.length);
    const buff = Buffer.from(base64Encoded, 'base64');
    return this.saveFileDataFromBuffer(buff, AVATARS_PATH, 'image/svg+xml');
  }
}
