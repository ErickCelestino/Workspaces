import { Module } from '@nestjs/common';
import { FindPlaylistCategoryByIdService } from './find-playlist-category-by-id.service';
import { FindPlaylistCategoryByIdController } from './find-playlist-category-by-id.controller';
import { FindPlaylistCategoryById } from '@workspaces/domain';
import {
  FindPlaylistCategoryByIdRepositoryImpl,
  FindUserByIdRepositoryImpl,
  PrismaGeneralService,
} from '@workspaces/data-access';

@Module({
  controllers: [FindPlaylistCategoryByIdController],
  providers: [
    FindPlaylistCategoryByIdService,
    FindPlaylistCategoryById,
    {
      provide: 'PrismaService',
      useClass: PrismaGeneralService,
    },
    {
      provide: 'FindUserByIdRepository',
      useClass: FindUserByIdRepositoryImpl,
    },
    {
      provide: 'FindPlaylistCategoryByIdRepository',
      useClass: FindPlaylistCategoryByIdRepositoryImpl,
    },
  ],
})
export class FindPlaylistCategoryByIdModule {}
