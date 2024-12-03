import { Inject } from '@nestjs/common';
import {
  DeleteSchedulingDto,
  DeleteSchedulingRepository,
} from '@workspaces/domain';
import { PrismaService } from '../../../../application';

export class DeleteSchedulingRepositoryImpl
  implements DeleteSchedulingRepository
{
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async delete(input: DeleteSchedulingDto): Promise<void> {
    await this.prismaService.generalPrisma.playlist_X_Scheduling.deleteMany({
      where: {
        scheduling_id: input.id,
      },
    });

    await this.prismaService.generalPrisma.scheduling.delete({
      where: {
        scheduling_id: input.id,
      },
    });
  }
}
