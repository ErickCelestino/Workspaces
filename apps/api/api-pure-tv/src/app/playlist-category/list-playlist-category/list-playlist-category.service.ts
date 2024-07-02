import { Injectable } from '@nestjs/common';
import {
  ListPlaylistCategory,
  ListPlaylistCategoryDto,
} from '@workspaces/domain';

@Injectable()
export class ListPlaylistCategoryService {
  constructor(private useCase: ListPlaylistCategory) {}
  async list(input: ListPlaylistCategoryDto) {
    return this.useCase.execute(input);
  }
}
