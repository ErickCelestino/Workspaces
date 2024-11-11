import { Injectable } from '@nestjs/common';
import { ChangeUserType, ChangeUserTypeDto } from '@workspaces/domain';

@Injectable()
export class ChangeUserTypeService {
  constructor(private useCase: ChangeUserType) {}

  async change(input: ChangeUserTypeDto) {
    return await this.useCase.execute(input);
  }
}
