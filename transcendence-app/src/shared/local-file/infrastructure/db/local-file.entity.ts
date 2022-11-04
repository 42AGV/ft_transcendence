export enum LocalFileKeys {
  ID = '"id"',
  FILENAME = '"filename"',
  PATH = '"path"',
  MIMETYPE = '"mimetype"',
  SIZE = '"size"',
  CREATED_AT = '"createdAt"',
}

export interface LocalFileData {
  id: string;
  filename: string;
  path: string;
  mimetype: string;
  size: number;
  createdAt: Date;
}

export class LocalFile {
  id: string;
  filename: string;
  path: string;
  mimetype: string;
  size: number;
  createdAt: Date;

  constructor(localFileData: LocalFileData) {
    this.id = localFileData.id;
    this.filename = localFileData.filename;
    this.path = localFileData.path;
    this.mimetype = localFileData.mimetype;
    this.size = localFileData.size;
    this.createdAt = localFileData.createdAt;
  }
}
