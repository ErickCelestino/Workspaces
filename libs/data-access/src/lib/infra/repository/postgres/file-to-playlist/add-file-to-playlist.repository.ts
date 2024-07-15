import { Inject } from '@nestjs/common';
import {
  AddFileToPlaylistDto,
  AddFileToPlaylistRepository,
} from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';

export class AddFileToPlaylistRepositoryImpl
  implements AddFileToPlaylistRepository
{
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async add(input: AddFileToPlaylistDto): Promise<string[]> {
    const { filesId, playlistId } = input;
    const listId: string[] = [];
    for (const file of filesId) {
      console.log(`file1: ${file}`);
      const createdFileToPlaylist =
        await this.prismaService.playlist_X_Content_Files.create({
          data: {
            playlist_id: playlistId,
            Content_Files_id: file,
          },
        });

      listId.push(
        `${createdFileToPlaylist.Content_Files_id}-${createdFileToPlaylist.playlist_id}`
      );
    }

    return listId;
  }
}
