import {
  ListPlaylistDto,
  ListPlaylistReponseDto,
  ListPlaylistRepository,
} from '../../../src';
import { ListPlaylistResponseMock } from '../../entity/playlist/list-playlist-response.mock';

export class ListPlaylistRepositoryMock implements ListPlaylistRepository {
  inputMock = {} as ListPlaylistDto;
  async list(input: ListPlaylistDto): Promise<ListPlaylistReponseDto> {
    this.inputMock = input;
    return ListPlaylistResponseMock;
  }
}
