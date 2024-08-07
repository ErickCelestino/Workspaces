import { Module } from '@nestjs/common';
import { DeleteUserByIdService } from './delete-user-by-id.service';
import { DeleteUserByIdController } from './delete-user-by-id.controller';
import {
  DeleteUserByIdRepositoryImpl,
  FindUserByIdRepositoryImpl,
  PrismaService,
  VerifyUserStatusByIdRepositoryImpl,
} from '@workspaces/data-access';
import { DeleteUserById } from '@workspaces/domain';

@Module({
  controllers: [DeleteUserByIdController],
  providers: [
    DeleteUserById,
    DeleteUserByIdService,
    {
      provide: 'PrismaService',
      useClass: PrismaService,
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
      provide: 'VerifyUserStatusByIdRepository',
      useClass: VerifyUserStatusByIdRepositoryImpl,
    },
  ],
})
export class DeleteUserByIdModule {}
