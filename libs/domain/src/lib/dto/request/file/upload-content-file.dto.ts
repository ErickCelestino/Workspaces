import { UploadedFile } from '../../../entity';

export interface UploadContentFileDto {
  file: UploadedFile;
  bucket: string;
  key: string;
}
