import {
  ListPlaylistBySchedulingIdDto,
  ListPlaylistBySchedulingIdRepository,
  ListPlaylistReponseDto,
} from '../../../src';
import { ListPlaylistReponseMock } from '../../entity';

export class ListPlaylistBySchedulingIdRepositoryMock
  implements ListPlaylistBySchedulingIdRepository
{
  inputMock = {} as ListPlaylistBySchedulingIdDto;
  async list(
    input: ListPlaylistBySchedulingIdDto
  ): Promise<ListPlaylistReponseDto> {
    this.inputMock = input;
    return ListPlaylistReponseMock;
  }
}
