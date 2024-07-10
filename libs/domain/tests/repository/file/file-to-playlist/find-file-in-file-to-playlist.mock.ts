import { FindFileInFileToPlaylistRepository } from '../../../../src';
import { ContentFileMock } from '../../../entity';

export class FindFileInFileToPlaylistRepositoryMock
  implements FindFileInFileToPlaylistRepository
{
  inputMock = '';
  async find(id: string): Promise<string> {
    this.inputMock = id;
    return '';
  }
}
