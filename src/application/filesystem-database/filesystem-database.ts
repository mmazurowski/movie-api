import { PathLike } from 'fs';
import { readFile, writeFile } from 'fs/promises';

export interface FileSystemDatabase {
  select<T extends {}>(path: PathLike): Promise<T>;
  update(path: PathLike, obj: object): Promise<void>;
}

export class FileSystemDatabaseImpl implements FileSystemDatabase {
  public async select<T extends {}>(path: PathLike): Promise<T> {
    const fileData = await readFile(path, { encoding: 'utf-8', flag: 'a+' });

    if (!fileData) {
      return null;
    }

    return JSON.parse(fileData) as T;
  }

  public async update(path: PathLike, obj: object): Promise<void> {
    await writeFile(path, JSON.stringify(obj, null, 2), { flag: 'w' });
  }
}
