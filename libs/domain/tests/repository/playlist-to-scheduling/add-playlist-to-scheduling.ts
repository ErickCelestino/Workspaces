import {
  AddPlaylistToSchedulingDto,
  AddPlaylistToSchedulingRepository,
} from '../../../src';
import { PlaylistMock, SchedulingMock } from '../../entity';

export class AddPlaylistsToSchedulingRepositoryMock
  implements AddPlaylistToSchedulingRepository
{
  inputMock = {} as AddPlaylistToSchedulingDto;
  async add(input: AddPlaylistToSchedulingDto): Promise<string> {
    this.inputMock = input;
    return `${PlaylistMock.id}-${SchedulingMock.id}`;
  }
}
