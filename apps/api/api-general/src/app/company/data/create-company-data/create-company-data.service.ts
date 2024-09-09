import { Injectable } from '@nestjs/common';
import { CreateCompanyData, CreateCompanyDataDto } from '@workspaces/domain';

@Injectable()
export class CreateCompanyDataService {
  constructor(private useCase: CreateCompanyData) {}

  async create(input: CreateCompanyDataDto) {
    return await this.useCase.execute(input);
  }
}
