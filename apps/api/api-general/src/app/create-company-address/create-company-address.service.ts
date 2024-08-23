import { Injectable } from '@nestjs/common';
import {
  CreateCompanyAddress,
  CreateCompanyAddressDto,
} from '@workspaces/domain';

@Injectable()
export class CreateCompanyAddressService {
  constructor(private useCase: CreateCompanyAddress) {}

  async create(input: CreateCompanyAddressDto) {
    return await this.useCase.execute(input);
  }
}
