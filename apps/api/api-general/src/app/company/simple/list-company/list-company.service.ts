import { Injectable } from '@nestjs/common';
import { ListCompany, ListCompanyDto } from '@workspaces/domain';

@Injectable()
export class ListCompanyService {
  constructor(private useCase: ListCompany) {}

  async list(input: ListCompanyDto) {
    return await this.useCase.execute(input);
  }
}
