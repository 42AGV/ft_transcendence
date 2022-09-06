export enum LocalFileKeys {
  ID = '"id"',
  FILENAME = '"filename"',
  PATH = '"path"',
  MIMETYPE = '"mimetype"',
  SIZE = '"size"',
  CREATED_AT = '"createdAt"',
}

export class LocalFileEntity {
  constructor(
    public id: string,
    public filename: string,
    public path: string,
    public mimetype: string,
    public size: number,
    public createdAt: Date,
  ) {}
}
