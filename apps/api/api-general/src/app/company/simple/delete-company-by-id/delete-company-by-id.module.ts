import { Module } from '@nestjs/common';
import { DeleteCompanyByIdService } from './delete-company-by-id.service';
import { DeleteCompanyByIdController } from './delete-company-by-id.controller';
import { DeleteCompanyById } from '@workspaces/domain';
import {
  DeleteCompanyByIdRepositoryImpl,
  FindCompanyByIdRepositoryImpl,
  FindUserByIdRepositoryImpl,
  PrismaService,
} from '@workspaces/data-access';

@Module({
  controllers: [DeleteCompanyByIdController],
  providers: [
    DeleteCompanyByIdService,
    DeleteCompanyById,
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
    {
      provide: 'FindUserByIdRepository',
      useClass: FindUserByIdRepositoryImpl,
    },
    {
      provide: 'FindCompanyByIdRepository',
      useClass: FindCompanyByIdRepositoryImpl,
    },
    {
      provide: 'DeleteCompanyByIdRepository',
      useClass: DeleteCompanyByIdRepositoryImpl,
    },
  ],
})
export class DeleteCompanyByIdModule {}
