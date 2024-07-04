import { FindPlaylistByIdRepository, Playlist } from '../../../src';
import { PlaylistMock } from '../../entity/playlist/playlist.mock';
export class FindPlaylistByIdRepositoryMock
  implements FindPlaylistByIdRepository
{
  inputMock = '';
  async find(id: string): Promise<Playlist> {
    this.inputMock = id;
    return PlaylistMock;
  }
}
