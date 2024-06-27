import {
  ListPlaylistCategoryDto,
  ListPlaylistCategoryRepository,
  PlaylistCategory,
} from '../../../../src';
import { PlaylistCategoryMock } from '../../../entity';
export class ListPlaylistCategoryRepositoryMock
  implements ListPlaylistCategoryRepository
{
  inputMock = {} as ListPlaylistCategoryDto;
  async list(input: ListPlaylistCategoryDto): Promise<PlaylistCategory[]> {
    this.inputMock = input;
    return [PlaylistCategoryMock];
  }
}
