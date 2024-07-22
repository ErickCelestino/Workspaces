import { Inject } from '@nestjs/common';
import {
  DeleteSchedulingDto,
  DeleteSchedulingRepository,
} from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';

export class DeleteSchedulingRepositoryImpl
  implements DeleteSchedulingRepository
{
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async delete(input: DeleteSchedulingDto): Promise<void> {
    await this.prismaService.scheduling.delete({
      where: {
        scheduling_id: input.id,
      },
    });
  }
}
