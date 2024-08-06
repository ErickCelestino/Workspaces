import { Inject } from '@nestjs/common';
import { DeleteDeviceDto, DeleteDeviceRepository } from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';

export class DeleteDeviceRepositoryImpl implements DeleteDeviceRepository {
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async delete(input: DeleteDeviceDto): Promise<void> {
    const { id } = input;

    await this.prismaService.device.delete({
      where: {
        device_id: id,
      },
    });
  }
}
