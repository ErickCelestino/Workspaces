import { Module } from '@nestjs/common';
import { EditDirectoryController } from './edit-directory.controller';
import { EditDirectoryService } from './edit-directory.service';
import { EditDirectory } from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';
import {
  EditDirectoryRepositoryImpl,
  FindDirectoryByIdRepositoryImpl,
  FindDirectoryByNameRepositoryImpl,
  FindUserByIdRepositoryImpl,
} from '@workspaces/data-access';

@Module({
  controllers: [EditDirectoryController],
  providers: [
    EditDirectoryService,
    EditDirectory,
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
    {
      provide: 'EditDirectoryRepository',
      useClass: EditDirectoryRepositoryImpl,
    },
    {
      provide: 'FindDirectoryByIdRepository',
      useClass: FindDirectoryByIdRepositoryImpl,
    },
    {
      provide: 'FindDirectoryByNameRepository',
      useClass: FindDirectoryByNameRepositoryImpl,
    },
    {
      provide: 'FindUserByIdRepository',
      useClass: FindUserByIdRepositoryImpl,
    },
  ],
})
export class EditDirectoryModule {}
