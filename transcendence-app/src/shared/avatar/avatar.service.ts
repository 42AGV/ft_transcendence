import {
  Injectable,
  Logger,
  StreamableFile,
  UnprocessableEntityException,
} from '@nestjs/common';
import { createReadStream } from 'fs';
import { AVATAR_MIMETYPE_WHITELIST } from '../constants';
import { LocalFileDto } from '../local-file/local-file.dto';
import { LocalFileService } from '../local-file/local-file.service';
import { loadEsmModule } from '../utils';

@Injectable()
export class AvatarService {
  private readonly logger = new Logger(AvatarService.name);

  constructor(private localFileService: LocalFileService) {}

  async getAvatarById(avatarId: string): Promise<StreamableFile | null> {
    const file = await this.localFileService.getFileById(avatarId);

    if (!file) {
      return null;
    }
    return this.streamAvatarData(file);
  }

  streamAvatarData(fileDto: LocalFileDto): StreamableFile {
    const stream = createReadStream(fileDto.path);

    return new StreamableFile(stream, {
      type: fileDto.mimetype,
      disposition: `inline; filename="${fileDto.filename}"`,
      length: fileDto.size,
    }).setErrorHandler((err) => err && this.logger.log(err.message));
  }

  async validateAvatarType(path: string): Promise<void> {
    /**
     * Import 'file-type' ES-Module in CommonJS Node.js module
     */
    const { fileTypeFromFile } = await loadEsmModule<
      typeof import('file-type')
    >('file-type');
    const fileTypeResult = await fileTypeFromFile(path);
    const isValid =
      fileTypeResult && AVATAR_MIMETYPE_WHITELIST.includes(fileTypeResult.mime);
    if (!isValid) {
      this.localFileService.deleteFileData(path);
      const allowedTypes = AVATAR_MIMETYPE_WHITELIST.join(', ');
      throw new UnprocessableEntityException(
        `Validation failed (allowed types are ${allowedTypes})`,
      );
    }
  }

  async deleteAvatar(avatarId: string) {
    const avatarFile = await this.localFileService.deleteFileById(avatarId);
    if (avatarFile) {
      this.localFileService.deleteFileData(avatarFile.path);
    }
  }
}
