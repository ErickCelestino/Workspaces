import { ListPlaylistCategoryDto } from '../../../dto';
import { PlaylistCategory } from '../../../entity';

export interface ListPlaylistCategoryRepository {
  list(input: ListPlaylistCategoryDto): Promise<PlaylistCategory[]>;
}
