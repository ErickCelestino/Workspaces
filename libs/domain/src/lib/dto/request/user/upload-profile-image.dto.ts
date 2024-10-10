import { UploadedFile } from '../../../entity';

export interface UploadProfileImageDto {
  loggedUserId: string;
  file: UploadedFile;
}
