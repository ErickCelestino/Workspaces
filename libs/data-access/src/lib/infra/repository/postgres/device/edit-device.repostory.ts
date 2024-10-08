import { Inject } from '@nestjs/common';
import { EditDeviceDto, EditDeviceRepository } from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';

export class EditDeviceRepositoryImpl implements EditDeviceRepository {
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async edit(input: EditDeviceDto): Promise<string> {
    const { id, name } = input;

    const editedDevice = await this.prismaService.device.update({
      where: {
        device_id: id,
      },
      data: {
        name,
      },
    });

    return editedDevice.device_id;
  }
}
