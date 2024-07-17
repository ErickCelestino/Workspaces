import { Module } from '@nestjs/common';
import { DeletePlaylistFilesService } from './delete-playlist-files.service';
import { DeletePlaylistFilesController } from './delete-playlist-files.controller';
import { DeletePlaylistFiles } from '@workspaces/domain';
import {
  DeletePlaylistFileRepositoryImpl,
  FindContentFileByIdRepositoryImpl,
  FindFileInFileToPlaylistRepositoryImpl,
  FindPlaylistByIdRepositoryImpl,
  FindUserByIdRepositoryImpl,
  PrismaService,
} from '@workspaces/data-access';

@Module({
  controllers: [DeletePlaylistFilesController],
  providers: [
    DeletePlaylistFilesService,
    DeletePlaylistFiles,
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
    {
      provide: 'FindUserByIdRepository',
      useClass: FindUserByIdRepositoryImpl,
    },
    {
      provide: 'FindContentFileByIdRepository',
      useClass: FindContentFileByIdRepositoryImpl,
    },
    {
      provide: 'FindPlaylistByIdRepository',
      useClass: FindPlaylistByIdRepositoryImpl,
    },
    {
      provide: 'FindFileInFileToPlaylistRepository',
      useClass: FindFileInFileToPlaylistRepositoryImpl,
    },
    {
      provide: 'DeletePlaylistFileRepository',
      useClass: DeletePlaylistFileRepositoryImpl,
    },
  ],
})
export class DeletePlaylistFilesModule {}
