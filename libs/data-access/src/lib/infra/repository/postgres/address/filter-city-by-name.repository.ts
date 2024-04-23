import { City, FilterCityByNameRepository } from '@workspaces/domain';
import { Inject } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

export class FilterCityByNameRepositoryImpl
  implements FilterCityByNameRepository
{
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async filter(input: string): Promise<City> {
    const filteredCity = await this.prismaService.city.findFirst({
      where: {
        name: input,
      },
      select: {
        city_id: true,
        name: true,
      },
    });
    const result = filteredCity == null ? ({} as City) : filteredCity;
    return result;
  }
}
