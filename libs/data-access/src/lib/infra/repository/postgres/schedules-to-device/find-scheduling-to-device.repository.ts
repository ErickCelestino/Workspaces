import { Inject } from '@nestjs/common';
import {
  FindSchedulingToDeviceByIdsDto,
  FindSchedulingToDeviceByIdsRepository,
} from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';

export class FindSchedulingToDeviceRepositoryImpl
  implements FindSchedulingToDeviceByIdsRepository
{
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async find(input: FindSchedulingToDeviceByIdsDto): Promise<string> {
    const filteredSchedulingToDevice =
      await this.prismaService.scheduling_X_Device.findMany({
        where: {
          device_id: input.idDevice,
          scheduling_id: input.idScheduling,
        },
      });

    return `${filteredSchedulingToDevice[0].scheduling_id}-${filteredSchedulingToDevice[0].device_id}`;
  }
}
