import { Injectable } from '@nestjs/common';
import { CreateCompany, CreateCompanyDto } from '@workspaces/domain';

@Injectable()
export class CreateCompanyService {
  constructor(private useCase: CreateCompany) {}

  async create(input: CreateCompanyDto) {
    return await this.useCase.execute(input);
  }
}
