import { Inject } from '@nestjs/common';
import { CityResponseDto, FindCityByIdRepository } from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';

export class FindCityByIdRepositoryImpl implements FindCityByIdRepository {
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async find(id: string): Promise<CityResponseDto> {
    const filteredCity = await this.prismaService.city.findUnique({
      where: {
        city_id: id,
      },
      select: {
        city_id: true,
        name: true,
      },
    });
    return {
      id: filteredCity?.city_id ?? '',
      name: filteredCity?.name ?? '',
    };
  }
}
