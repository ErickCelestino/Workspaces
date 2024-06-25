import { UploadedFile } from '../../../entity';

export interface RegisterContentFileDto {
  loggedUserId: string;
  directoryId: string;
  file: UploadedFile;
}
