import { Module } from '@nestjs/common';
import { ListPlaylistCategoryService } from './list-playlist-category.service';
import { ListPlaylistCategoryController } from './list-playlist-category.controller';
import { ListPlaylistCategory } from '@workspaces/domain';
import {
  FindUserByIdRepositoryImpl,
  ListPlaylistCategoryRepositoryImpl,
  PrismaService,
} from '@workspaces/data-access';

@Module({
  controllers: [ListPlaylistCategoryController],
  providers: [
    ListPlaylistCategoryService,
    ListPlaylistCategory,
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
    {
      provide: 'FindUserByIdRepository',
      useClass: FindUserByIdRepositoryImpl,
    },
    {
      provide: 'ListPlaylistCategoryRepository',
      useClass: ListPlaylistCategoryRepositoryImpl,
    },
  ],
})
export class ListPlaylistCategoryModule {}
