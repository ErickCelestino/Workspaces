import { Injectable } from '@nestjs/common';
import {
  EditPlaylistCategory,
  EditPlaylistCategoryDto,
} from '@workspaces/domain';

@Injectable()
export class EditPlaylistCategoryService {
  constructor(private useCase: EditPlaylistCategory) {}

  async edit(input: EditPlaylistCategoryDto) {
    return await this.useCase.execute(input);
  }
}
