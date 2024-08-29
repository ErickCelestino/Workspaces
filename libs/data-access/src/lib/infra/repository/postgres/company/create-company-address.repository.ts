import { Inject } from '@nestjs/common';
import {
  CreateCompanyAddressDto,
  CreateCompanyAddressRepository,
} from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';

export class CreateCompanyAddressRepositoryImpl
  implements CreateCompanyAddressRepository
{
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async create(input: CreateCompanyAddressDto): Promise<string> {
    const {
      body: { cityId, district, number, street, zipcode, complement },
      companyId,
    } = input;

    const createdCompanyAddress = await this.prismaService.address.create({
      data: {
        city_id: cityId,
        district: district,
        number: number,
        street: street,
        zipcode: zipcode,
        complement: complement ?? '',
      },
    });

    await this.prismaService.company_X_Address.create({
      data: {
        company_id: companyId,
        address_id: createdCompanyAddress.address_id,
      },
    });

    return createdCompanyAddress.address_id;
  }
}
