import { Module } from '@nestjs/common';
import { EditContentFileService } from './edit-content-file.service';
import { EditContentFileController } from './edit-content-file.controller';
import {
  EditContentFileRepositoryImpl,
  FindContentFileByIdRepositoryImpl,
  FindDirectoryByIdRepositoryImpl,
  FindUserByIdRepositoryImpl,
  PrismaService,
} from '@workspaces/data-access';
import { EditContentFile } from '@workspaces/domain';

@Module({
  controllers: [EditContentFileController],
  providers: [
    EditContentFile,
    EditContentFileService,
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
    {
      provide: 'FindUserByIdRepository',
      useClass: FindUserByIdRepositoryImpl,
    },
    {
      provide: 'FindDirectoryByIdRepository',
      useClass: FindDirectoryByIdRepositoryImpl,
    },
    {
      provide: 'FindContentFileByIdRepository',
      useClass: FindContentFileByIdRepositoryImpl,
    },
    {
      provide: 'EditContentFileRepository',
      useClass: EditContentFileRepositoryImpl,
    },
  ],
})
export class EditContentFileModule {}
