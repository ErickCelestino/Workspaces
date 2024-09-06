import { Injectable } from '@nestjs/common';
import {
  FindCompanyResponsibleById,
  FindCompanyResponsibleByIdDto,
} from '@workspaces/domain';

@Injectable()
export class FindCompanyResponsibleByIdService {
  constructor(private useCase: FindCompanyResponsibleById) {}

  async find(input: FindCompanyResponsibleByIdDto) {
    return await this.useCase.execute(input);
  }
}
