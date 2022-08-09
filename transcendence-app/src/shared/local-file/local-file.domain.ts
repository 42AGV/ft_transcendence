export class LocalFile {
  constructor(
    public id: string,
    public filename: string,
    public path: string,
    public mimetype: string,
    public size: number,
    public createdAt: Date,
  ) {}
}
