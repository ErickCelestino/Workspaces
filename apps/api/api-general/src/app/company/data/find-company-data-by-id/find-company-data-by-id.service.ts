import { Injectable } from '@nestjs/common';
import {
  FindCompanyDataById,
  FindCompanyDataByIdDto,
} from '@workspaces/domain';

@Injectable()
export class FindCompanyDataByIdService {
  constructor(private useCase: FindCompanyDataById) {}

  async find(input: FindCompanyDataByIdDto) {
    return await this.useCase.execute(input);
  }
}
