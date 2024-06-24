import { Injectable } from '@nestjs/common';
import { EditContentFile, EditContentFileDto } from '@workspaces/domain';

@Injectable()
export class EditContentFileService {
  constructor(private useCase: EditContentFile) {}

  async edit(input: EditContentFileDto) {
    return this.useCase.execute(input);
  }
}
