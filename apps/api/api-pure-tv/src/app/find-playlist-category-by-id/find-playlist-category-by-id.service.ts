import { Injectable } from '@nestjs/common';
import {
  FindPlaylistCategoryById,
  FindPlaylistCategoryByIdDto,
} from '@workspaces/domain';

@Injectable()
export class FindPlaylistCategoryByIdService {
  constructor(private useCase: FindPlaylistCategoryById) {}

  async find(input: FindPlaylistCategoryByIdDto) {
    return this.useCase.execute(input);
  }
}
