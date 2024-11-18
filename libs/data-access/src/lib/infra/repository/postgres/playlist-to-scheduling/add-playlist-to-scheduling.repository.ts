import { Inject } from '@nestjs/common';
import {
  PlaylistToSchedulingDto,
  AddPlaylistToSchedulingRepository,
} from '@workspaces/domain';
import { PrismaService } from '../../../../application';

export class AddPlaylistToSchedulingRepositoryImpl
  implements AddPlaylistToSchedulingRepository
{
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async add(input: PlaylistToSchedulingDto): Promise<string> {
    const { playlistId, schedulingId } = input;

    const createdPlaylistToScheduling =
      await this.prismaService.generalPrisma.playlist_X_Scheduling.create({
        data: {
          playlist_id: playlistId,
          scheduling_id: schedulingId,
        },
      });

    return `${createdPlaylistToScheduling.playlist_id}-${createdPlaylistToScheduling.scheduling_id}`;
  }
}
