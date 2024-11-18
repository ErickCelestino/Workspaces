import { Inject } from '@nestjs/common';
import {
  EditCompanyAddressDto,
  EditCompanyAddressRepository,
} from '@workspaces/domain';
import { PrismaService } from '../../../../../application';

export class EditCompanyAddressRepositoryImpl
  implements EditCompanyAddressRepository
{
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async edit(input: EditCompanyAddressDto): Promise<string> {
    const {
      body: { cityId, district, number, street, zipcode, complement },
      companyAddressId,
    } = input;

    const editedCompanyAddress =
      await this.prismaService.generalPrisma.address.update({
        where: {
          address_id: companyAddressId,
        },
        data: {
          city_id: cityId,
          district: district,
          number: number,
          street: street,
          zipcode: zipcode,
          complement: complement ?? '',
        },
      });

    return editedCompanyAddress?.address_id ?? '';
  }
}
