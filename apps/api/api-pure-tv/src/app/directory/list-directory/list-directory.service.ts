import { Injectable } from '@nestjs/common';
import { ListDirectory, ListDirectoryDto } from '@workspaces/domain';

@Injectable()
export class ListDirectoryService {
  constructor(private useCase: ListDirectory) {}

  async list(input: ListDirectoryDto) {
    return await this.useCase.execute(input);
  }
}
