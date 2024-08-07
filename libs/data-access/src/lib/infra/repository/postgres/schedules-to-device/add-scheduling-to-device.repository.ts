import { Inject } from '@nestjs/common';
import {
  AddSchedulingToDeviceDto,
  AddSchedulingToDeviceRepository,
} from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';

export class AddSchedulingToDeviceRepositoryImpl
  implements AddSchedulingToDeviceRepository
{
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async add(input: AddSchedulingToDeviceDto): Promise<string> {
    const { idDevice, idSchedule } = input;

    const createdSchedulingToDevice =
      await this.prismaService.scheduling_X_Device.create({
        data: {
          device_id: idDevice,
          scheduling_id: idSchedule,
        },
      });

    return createdSchedulingToDevice.device_id;
  }
}
