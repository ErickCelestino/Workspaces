import { Injectable } from '@nestjs/common';
import {
  AddUserToAnotherCompany,
  AddUserToAnotherCompanyDto,
} from '@workspaces/domain';

@Injectable()
export class AddUserToAnotherCompanyService {
  constructor(private useCase: AddUserToAnotherCompany) {}

  async add(input: AddUserToAnotherCompanyDto) {
    return await this.useCase.execute(input);
  }
}
