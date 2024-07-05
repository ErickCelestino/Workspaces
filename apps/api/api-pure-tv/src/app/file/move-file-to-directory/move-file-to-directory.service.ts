import { Injectable } from '@nestjs/common';
import {
  MoveFileToDirectory,
  MoveFileToDirectoryDto,
} from '@workspaces/domain';

@Injectable()
export class MoveFileToDirectoryService {
  constructor(private useCase: MoveFileToDirectory) {}

  async move(input: MoveFileToDirectoryDto) {
    return await this.useCase.execute(input);
  }
}
