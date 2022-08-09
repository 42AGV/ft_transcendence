import { Injectable, Logger } from '@nestjs/common';
import { ILocalFileRepository } from './infrastructure/db/local-file.repository';
import { LocalFileDto } from './local-file.dto';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';
import { join } from 'path';
import { createWriteStream, mkdir, ReadStream, unlink } from 'fs';
import { LocalFileConfig } from './local-file.config.interface';
import { LocalFile } from './local-file.domain';

@Injectable()
export class LocalFileService {
  private readonly logger = new Logger(LocalFileService.name);

  constructor(
    private configService: ConfigService<LocalFileConfig>,
    private repository: ILocalFileRepository,
  ) {}

  getFileById(id: string): Promise<LocalFile | null> {
    return this.repository.getById(id);
  }

  saveFile(localFileDto: LocalFileDto): Promise<LocalFile | null> {
    return this.repository.addFile({ id: uuidv4(), ...localFileDto });
  }

  private createDirectory(directory: string) {
    return mkdir(directory, { recursive: true }, (err) => {
      if (err) {
        this.logger.error(err.message);
        throw err;
      }
    });
  }

  async saveFileData(
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

  deleteFileData(path: string): void {
    unlink(path, (err) => {
      if (err) {
        this.logger.error(err.message);
      }
    });
  }

  async deleteFileById(id: string): Promise<LocalFile | null> {
    const file = await this.repository.deleteById(id);

    if (!file) {
      return null;
    }
    this.deleteFileData(file.path);
    return file;
  }

  updateFileById(
    id: string,
    localFileDto: Partial<LocalFileDto>,
  ): Promise<LocalFile | null> {
    return this.repository.updateById(id, localFileDto);
  }
}