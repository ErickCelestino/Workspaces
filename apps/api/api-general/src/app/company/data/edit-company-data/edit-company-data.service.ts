import { Injectable } from '@nestjs/common';
import { EditCompanyData, EditCompanyDataDto } from '@workspaces/domain';

@Injectable()
export class EditCompanyDataService {
  constructor(private useCase: EditCompanyData) {}

  async edit(input: EditCompanyDataDto) {
    return await this.useCase.execute(input);
  }
}
