import { UploadedFile } from '../../../entity';

export interface CreateContentFileDto {
  loggedUserId: string;
  directoryId: string;
  file: UploadedFile[];
}
