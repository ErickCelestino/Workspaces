import { FindFileInFileToPlaylistRepository } from '../../../src';

export class FindFileInFileToPlaylistRepositoryMock
  implements FindFileInFileToPlaylistRepository
{
  inputMock = '';
  async find(id: string): Promise<string> {
    this.inputMock = id;
    return '';
  }
}
