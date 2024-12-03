import { Inject } from '@nestjs/common';
import {
  DeleteSchedulingToDeviceDto,
  DeleteSchedulingToDeviceRepository,
} from '@workspaces/domain';
import { PrismaService } from '../../../../application';

export class DeleteSchedulingToDeviceRepositoryImpl
  implements DeleteSchedulingToDeviceRepository
{
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async delete(input: DeleteSchedulingToDeviceDto): Promise<string> {
    const deletedScheduling =
      await this.prismaService.generalPrisma.scheduling_X_Device.delete({
        where: {
          device_id_scheduling_id: {
            device_id: input.idDevice,
            scheduling_id: input.schedulingId,
          },
        },
      });

    return deletedScheduling?.device_id ?? '';
  }
}
