import { PlaylistCategory } from '../../../../entity';

export interface ListPlaylistCategoryReponseDto {
  total: number;
  filteredTotal: number;
  categories: PlaylistCategory[];
}
