import {
  CreateCompanyAddressDto,
  CreateCompanyAddressRepository,
} from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';
import { Inject } from '@nestjs/common';

export class CreateCompanyAddressRepositoryImpl
  implements CreateCompanyAddressRepository
{
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}

  async create(input: CreateCompanyAddressDto): Promise<void> {
    const { address, company_id } = input;

    await this.prismaService.address.create({
      data: {
        district: address.district,
        number: address.number,
        street: address.street,
        zipcode: address.zipcode,
        city_id: address.city_id,
      },
    });

    const filterAddress = await this.prismaService.address.findFirst({
      where: {
        zipcode: address.zipcode,
        street: address.street,
      },
      select: {
        address_id: true,
      },
    });

    await this.prismaService.company_X_Address.create({
      data: {
        address_id: filterAddress == null ? '' : filterAddress.address_id,
        company_id: company_id,
      },
    });
  }
}
