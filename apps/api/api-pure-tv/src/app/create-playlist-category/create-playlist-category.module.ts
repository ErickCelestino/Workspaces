import { Module } from '@nestjs/common';
import { CreatePlaylistCategoryService } from './create-playlist-category.service';
import { CreatePlaylistCategoryController } from './create-playlist-category.controller';
import { CreatePlaylistCategory } from '@workspaces/domain';
import {
  FindUserByIdRepositoryImpl,
  PrismaService,
  CreatePlaylistCategoryRepositoryImpl,
  FindPlaylistCategoryByNameRepositoryImpl,
} from '@workspaces/data-access';

@Module({
  controllers: [CreatePlaylistCategoryController],
  providers: [
    CreatePlaylistCategoryService,
    CreatePlaylistCategory,
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
    {
      provide: 'FindUserByIdRepository',
      useClass: FindUserByIdRepositoryImpl,
    },
    {
      provide: 'CreatePlaylistCategoryRepository',
      useClass: CreatePlaylistCategoryRepositoryImpl,
    },
    {
      provide: 'CreatePlaylistCategoryRepository',
      useClass: CreatePlaylistCategoryRepositoryImpl,
    },
    {
      provide: 'FindPlaylistCategoryByNameRepository',
      useClass: FindPlaylistCategoryByNameRepositoryImpl,
    },
  ],
})
export class CreatePlaylistCategoryModule {}
