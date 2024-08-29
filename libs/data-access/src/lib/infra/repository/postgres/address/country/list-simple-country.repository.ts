import { Inject } from '@nestjs/common';
import {
  ListSimpleCountryRepository,
  ListSimpleCountryResponseDto,
} from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';

export class ListSimpleCountryRepositoryImpl
  implements ListSimpleCountryRepository
{
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async list(): Promise<ListSimpleCountryResponseDto[]> {
    const listCountry = await this.prismaService.country.findMany({
      select: {
        name: true,
        uf: true,
        country_id: true,
      },
    });

    const mappedCountry: ListSimpleCountryResponseDto[] = listCountry.map(
      (country) => {
        return {
          id: country?.country_id ?? '',
          name: country?.name ?? '',
          uf: country?.uf ?? '',
        };
      }
    );

    return mappedCountry;
  }
}
