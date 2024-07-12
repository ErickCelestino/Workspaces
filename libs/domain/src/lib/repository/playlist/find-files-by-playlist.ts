import { FindFilesByPlaylistDto } from '../../dto';
import { ContentFile } from '../../entity';

export interface FindFilesByPlaylistRepository {
  find(input: FindFilesByPlaylistDto): Promise<ContentFile[]>;
}
