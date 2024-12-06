import { Module } from '@nestjs/common';
import { ChangeUserTypeService } from './change-user-type.service';
import { ChangeUserTypeController } from './change-user-type.controller';
import { ChangeUserType } from '@workspaces/domain';
import {
  ChangeUserTypeRepositoryImpl,
  FindUserByIdRepositoryImpl,
  PrismaGeneralService,
  VerifyUserPermissionsByIdRepositoryImpl,
} from '@workspaces/data-access';

@Module({
  controllers: [ChangeUserTypeController],
  providers: [
    ChangeUserTypeService,
    ChangeUserType,
    {
      provide: 'PrismaService',
      useClass: PrismaGeneralService,
    },
    {
      provide: 'FindUserByIdRepository',
      useClass: FindUserByIdRepositoryImpl,
    },
    {
      provide: 'VerifyUserPermissionsByIdRepository',
      useClass: VerifyUserPermissionsByIdRepositoryImpl,
    },
    {
      provide: 'ChangeUserTypeRepository',
      useClass: ChangeUserTypeRepositoryImpl,
    },
  ],
})
export class ChangeUserTypeModule {}
