import { Module } from '@nestjs/common';
import { DeletePlaylistCategoryService } from './delete-playlist-category.service';
import { DeletePlaylistCategoryController } from './delete-playlist-category.controller';
import { DeletePlaylistCategory } from '@workspaces/domain';
import {
  DeletePlaylistCategoryRepositoryImpl,
  FindPlaylistCategoryByIdRepositoryImpl,
  FindUserByIdRepositoryImpl,
  PrismaService,
} from '@workspaces/data-access';

@Module({
  controllers: [DeletePlaylistCategoryController],
  providers: [
    DeletePlaylistCategoryService,
    DeletePlaylistCategory,
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
    {
      provide: 'FindUserByIdRepository',
      useClass: FindUserByIdRepositoryImpl,
    },
    {
      provide: 'FindPlaylistCategoryByIdRepository',
      useClass: FindPlaylistCategoryByIdRepositoryImpl,
    },
    {
      provide: 'DeletePlaylistCategoryRepository',
      useClass: DeletePlaylistCategoryRepositoryImpl,
    },
  ],
})
export class DeletePlaylistCategoryModule {}
