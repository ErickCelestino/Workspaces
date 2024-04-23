import {
  CreateCompanyAddressDto,
  CreateCompanyAddressRepository,
} from '../../../src';

export class CreateCompanyAddressRepositoryMock
  implements CreateCompanyAddressRepository
{
  async create(input: CreateCompanyAddressDto): Promise<void> {}
}
