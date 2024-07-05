import { Playlist } from '../../../entity';

export interface ListPlaylistReponseDto {
  total: number;
  filteredTotal: number;
  totalPages: number;
  playlists: Playlist[];
}
