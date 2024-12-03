import { Inject } from '@nestjs/common';
import {
  DeletePlaylistToSchedulingDto,
  DeletePlaylistToSchedulingRepository,
} from '@workspaces/domain';
import { PrismaService } from '../../../../application';

export class DeletePlaylistToSchedulingRepositoryImpl
  implements DeletePlaylistToSchedulingRepository
{
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async delete(input: DeletePlaylistToSchedulingDto): Promise<void> {
    const { playlistId, schedulingId } = input;
    await this.prismaService.generalPrisma.playlist_X_Scheduling.deleteMany({
      where: {
        playlist_id: playlistId,
        scheduling_id: schedulingId,
      },
    });
  }
}
