import { Playlist } from '../../entity';

export interface FindPlaylistByIdRepository {
  find(id: string): Promise<Playlist>;
}
