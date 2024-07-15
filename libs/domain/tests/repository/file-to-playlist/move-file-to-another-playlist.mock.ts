import {
  MoveFilesToAnotherPlaylistDto,
  MoveFileToAnotherPlaylistRepository,
} from '../../../src';

export class MoveFileToAnotherPlaylistRepositoryMock
  implements MoveFileToAnotherPlaylistRepository
{
  inputMock = {} as MoveFilesToAnotherPlaylistDto;
  async move(input: MoveFilesToAnotherPlaylistDto): Promise<void> {
    this.inputMock = input;
  }
}
