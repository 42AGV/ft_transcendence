import { Injectable, Logger } from '@nestjs/common';
import { LocalFileDto } from './local-file.dto';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';
import { join } from 'path';
import { createWriteStream, mkdir, ReadStream, unlink } from 'fs';
import { LocalFileConfig } from './local-file.config.interface';

@Injectable()
export class LocalFileService {
  private readonly logger = new Logger(LocalFileService.name);

  constructor(private configService: ConfigService<LocalFileConfig>) {}

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
}
