import { Module } from '@nestjs/common';
import { DeleteUserByIdService } from './delete-user-by-id.service';
import { DeleteUserByIdController } from './delete-user-by-id.controller';
import {
  DeleteUserByIdRepositoryImpl,
  FindUserByIdRepositoryImpl,
  PrismaGeneralService,
  VerifyUserPermissionsByIdRepositoryImpl,
} from '@workspaces/data-access';
import { DeleteUserById } from '@workspaces/domain';

@Module({
  controllers: [DeleteUserByIdController],
  providers: [
    DeleteUserById,
    DeleteUserByIdService,
    {
      provide: 'PrismaService',
      useClass: PrismaGeneralService,
    },
    {
      provide: 'FindUserByIdRepository',
      useClass: FindUserByIdRepositoryImpl,
    },
    {
      provide: 'DeleteUserByIdRepository',
      useClass: DeleteUserByIdRepositoryImpl,
    },
    {
      provide: 'VerifyUserPermissionsByIdRepository',
      useClass: VerifyUserPermissionsByIdRepositoryImpl,
    },
  ],
})
export class DeleteUserByIdModule {}
