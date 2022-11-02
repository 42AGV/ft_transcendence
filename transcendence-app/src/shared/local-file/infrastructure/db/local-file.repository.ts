import { LocalFile } from './local-file.entity';

export abstract class ILocalFileRepository {
  abstract getById(id: string): Promise<LocalFile | null>;
  abstract deleteById(id: string): Promise<LocalFile | null>;
  abstract updateById(
    id: string,
    file: Partial<LocalFile>,
  ): Promise<LocalFile | null>;
  abstract addFile(file: LocalFile): Promise<LocalFile | null>;
}
