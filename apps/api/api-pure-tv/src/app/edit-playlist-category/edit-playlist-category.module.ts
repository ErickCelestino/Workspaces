import { Module } from '@nestjs/common';
import { EditPlaylistCategoryService } from './edit-playlist-category.service';
import { EditPlaylistCategoryController } from './edit-playlist-category.controller';
import { EditPlaylistCategory } from '@workspaces/domain';
import {
  EditPlaylistCategoryRepositoryImpl,
  FindPlaylistCategoryByIdRepositoryImpl,
  FindUserByIdRepositoryImpl,
  PrismaService,
} from '@workspaces/data-access';

@Module({
  controllers: [EditPlaylistCategoryController],
  providers: [
    EditPlaylistCategoryService,
    EditPlaylistCategory,
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
      provide: 'EditPlaylistCategoryRepository',
      useClass: EditPlaylistCategoryRepositoryImpl,
    },
  ],
})
export class EditPlaylistCategoryModule {}
