import { Injectable } from '@nestjs/common';
import { EditCompanyAddress, EditCompanyAddressDto } from '@workspaces/domain';

@Injectable()
export class EditCompanyAddressService {
  constructor(private useCase: EditCompanyAddress) {}

  async edit(input: EditCompanyAddressDto) {
    return await this.useCase.execute(input);
  }
}
