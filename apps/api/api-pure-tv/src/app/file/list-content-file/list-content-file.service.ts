import { Injectable } from '@nestjs/common';
import { ListContentFile, ListContentFileDto } from '@workspaces/domain';

@Injectable()
export class ListContentFileService {
  constructor(private useCase: ListContentFile) {}

  async list(input: ListContentFileDto) {
    return this.useCase.execute(input);
  }
}
