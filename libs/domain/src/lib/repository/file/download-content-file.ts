import { DownloadContentFileDto } from '../../dto';

export interface DownloadContentFileRepository {
  download(input: DownloadContentFileDto): Promise<void>;
}
