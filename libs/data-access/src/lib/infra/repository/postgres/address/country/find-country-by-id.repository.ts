import { Inject } from '@nestjs/common';
import {
  CountryResponseDto,
  FindCountryByIdRepository,
} from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';

export class FindCountryByIdRepositoryImpl
  implements FindCountryByIdRepository
{
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async find(id: string): Promise<CountryResponseDto> {
    const filteredCountry = await this.prismaService.country.findUnique({
      where: {
        country_id: id,
      },
      select: {
        country_id: true,
        name: true,
        uf: true,
        state: {
          select: {
            state_id: true,
            name: true,
            uf: true,
            city: {
              select: {
                city_id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    const mappedState =
      filteredCountry?.state.map((state) => {
        const mappedCity =
          state?.city.map((city) => {
            return {
              id: city?.city_id ?? '',
              name: city?.name ?? '',
            };
          }) ?? [];

        return {
          id: state?.state_id ?? '',
          name: state?.name ?? '',
          uf: state?.uf ?? '',
          cities: mappedCity,
        };
      }) ?? [];

    return {
      id: filteredCountry?.country_id ?? '',
      name: filteredCountry?.name ?? '',
      uf: filteredCountry?.uf ?? '',
      states: mappedState,
    };
  }
}
