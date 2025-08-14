import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { existsSync, mkdirSync, writeFile } from 'fs';

@Injectable()
export class UploadService {
  private readonly uploadPath = join(__dirname, '..', 'uploads');

  constructor() {
    if (!existsSync(this.uploadPath)) {
      mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  async saveFile(file: Express.Multer.File): Promise<string> {
    const filePath = join(this.uploadPath, file.filename);
    await writeFile(filePath, file.buffer, (err) => {
      if (err) {
        throw new Error('File upload failed');
      }
    });
    return filePath;
  }
}
