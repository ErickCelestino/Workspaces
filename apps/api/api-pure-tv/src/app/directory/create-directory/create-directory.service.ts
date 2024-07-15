import { Injectable } from '@nestjs/common';
import { CreateDirectory, CreateDirectoryDto } from '@workspaces/domain';

@Injectable()
export class CreateDirectoryService {
  constructor(private useCase: CreateDirectory) {}

  async create(input: CreateDirectoryDto) {
    return await this.useCase.execute(input);
  }
}
