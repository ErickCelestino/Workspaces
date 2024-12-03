import { Inject } from '@nestjs/common';
import { DeleteDeviceDto, DeleteDeviceRepository } from '@workspaces/domain';
import { PrismaService } from '../../../../application';

export class DeleteDeviceRepositoryImpl implements DeleteDeviceRepository {
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async delete(input: DeleteDeviceDto): Promise<void> {
    const { id } = input;

    await this.prismaService.generalPrisma.device.delete({
      where: {
        device_id: id,
      },
    });
  }
}
