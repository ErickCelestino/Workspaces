import { Injectable } from '@nestjs/common';
import { CreateContentFile, CreateContentFileDto } from '@workspaces/domain';

@Injectable()
export class CreateContentFileService {
  constructor(private useCase: CreateContentFile) {}

  async create(input: CreateContentFileDto) {
    return await this.useCase.execute(input);
  }
}
