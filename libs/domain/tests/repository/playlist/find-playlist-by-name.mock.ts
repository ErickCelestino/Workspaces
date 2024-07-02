import {
  FindPlaylistByNameDto,
  FindPlaylistByNameRepository,
  Playlist,
} from '../../../src';
import { PlaylistMock } from '../../entity/playlist/playlist.mock';
export class FindPlaylistByNameRepositoryMock
  implements FindPlaylistByNameRepository
{
  inputMock = {} as FindPlaylistByNameDto;
  async find(input: FindPlaylistByNameDto): Promise<Playlist> {
    this.inputMock = input;
    return PlaylistMock;
  }
}
