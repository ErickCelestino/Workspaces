import { ListPlaylistDto, ListPlaylistReponseDto } from '../../dto';

export interface ListPlaylistRepository {
  list(input: ListPlaylistDto): Promise<ListPlaylistReponseDto>;
}
