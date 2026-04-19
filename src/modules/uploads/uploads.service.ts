import { Injectable } from '@nestjs/common';

export interface UploadResult {
  url: string;
  filename: string;
  size: number;
  mimetype: string;
}

@Injectable()
export class UploadsService {
  /**
   * Persist a file and return its public URL.
   * Swap this implementation for Cloudinary when ready —
   * the return shape (UploadResult) stays the same.
   */
  save(file: Express.Multer.File): UploadResult {
    return {
      url: `/uploads/${file.filename}`,
      filename: file.filename,
      size: file.size,
      mimetype: file.mimetype,
    };
  }
}
