import { Injectable } from '@nestjs/common';
import {
  FindSimpleCompanyById,
  FindSimpleCompanyByIdDto,
} from '@workspaces/domain';

@Injectable()
export class FindSimpleCompanyByIdService {
  constructor(private useCase: FindSimpleCompanyById) {}

  async find(input: FindSimpleCompanyByIdDto) {
    return this.useCase.execute(input);
  }
}
