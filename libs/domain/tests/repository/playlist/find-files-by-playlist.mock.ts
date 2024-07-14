import {
  ContentFile,
  FindFilesByPlaylistDto,
  FindFilesByPlaylistRepository,
} from '../../../src';
import { ContentFileMock } from '../../entity';

export class FindFilesByPlaylistRepositoryMock
  implements FindFilesByPlaylistRepository
{
  inputMock = {} as FindFilesByPlaylistDto;
  async find(input: FindFilesByPlaylistDto): Promise<ContentFile[]> {
    this.inputMock = input;
    return [ContentFileMock];
  }
}
