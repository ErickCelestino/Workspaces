import { UploadFileDto } from '../../dto';

export interface UploadFileRepository {
  upload(input: UploadFileDto): Promise<void>;
}
