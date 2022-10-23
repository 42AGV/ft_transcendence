import { Injectable, Logger } from '@nestjs/common';
import { LocalFileDto } from './local-file.dto';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';
import { join } from 'path';
import { createWriteStream, mkdir, ReadStream, unlink } from 'fs';
import { LocalFileConfig } from './local-file.config.interface';
import { LocalFile } from './local-file.domain';
import { ILocalFileRepository } from './infrastructure/db/local-file.repository';

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

  async saveFileDataFromStream(
    data: ReadStream,
    path: string,
    mimetype: string,
  ): Promise<LocalFileDto> {
    const filesPath = this.configService.get(
      'TRANSCENDENCE_APP_DATA',
    ) as string;
    const filename = randomBytes(16).toString('hex');
    const directory = join(filesPath, path);
    this.createDirectory(directory);
    const finalPath = join(directory, filename);
    const outStream = createWriteStream(finalPath);
    data.pipe(outStream);

    return new Promise((resolve, reject) => {
      outStream.on('finish', () =>
        resolve({
          filename,
          mimetype,
          path: finalPath,
          size: outStream.bytesWritten,
        }),
      );
      outStream.on('error', reject);
    });
  }

  async saveFileDataFromBuffer(
    data: Buffer,
    path: string,
    mimetype: string,
  ): Promise<LocalFileDto> {
    const filesPath = this.configService.get(
      'TRANSCENDENCE_APP_DATA',
    ) as string;
    const filename = randomBytes(16).toString('hex');
    const directory = join(filesPath, path);
    this.createDirectory(directory);
    const finalPath = join(directory, filename);
    const outStream = createWriteStream(finalPath);
    outStream.write(data);
    outStream.end();

    return new Promise((resolve, reject) => {
      outStream.on('finish', () =>
        resolve({
          filename,
          mimetype,
          path: finalPath,
          size: outStream.bytesWritten,
        }),
      );
      outStream.on('error', reject);
    });
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
}
