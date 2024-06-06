import { UploadedFile } from '../../../entity';

export interface CreateContentVideoDto {
  loggedUserId: string;
  directoryId: string;
  file: UploadedFile[];
}
