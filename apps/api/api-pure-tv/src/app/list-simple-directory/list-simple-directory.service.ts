import { Injectable } from '@nestjs/common';
import {
  ListSimpleDirectory,
  ListSimpleDirectoryDto,
} from '@workspaces/domain';

@Injectable()
export class ListSimpleDirectoryService {
  constructor(private useCase: ListSimpleDirectory) {}

  async list(input: ListSimpleDirectoryDto) {
    return this.useCase.execute(input);
  }
}
