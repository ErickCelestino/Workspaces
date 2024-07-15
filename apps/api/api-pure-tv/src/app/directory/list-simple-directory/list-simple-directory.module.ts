import { Module } from '@nestjs/common';
import { ListSimpleDirectoryService } from './list-simple-directory.service';
import { ListSimpleDirectoryController } from './list-simple-directory.controller';
import { ListSimpleDirectory } from '@workspaces/domain';
import {
  FindUserByIdRepositoryImpl,
  ListSimpleDirectoryRepositoryImpl,
  PrismaService,
} from '@workspaces/data-access';

@Module({
  controllers: [ListSimpleDirectoryController],
  providers: [
    ListSimpleDirectoryService,
    ListSimpleDirectory,
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
    {
      provide: 'FindUserByIdRepository',
      useClass: FindUserByIdRepositoryImpl,
    },
    {
      provide: 'ListSimpleDirectoryRepository',
      useClass: ListSimpleDirectoryRepositoryImpl,
    },
  ],
})
export class ListSimpleDirectoryModule {}
