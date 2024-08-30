import { Module } from '@nestjs/common';
import { ConsultZipcodeService } from './consult-zipcode.service';
import { ConsultZipcodeController } from './consult-zipcode.controller';
import { ConsultZipcode } from '@workspaces/domain';
import {
  ConsultZipcodeRepositoryImpl,
  FindUserByIdRepositoryImpl,
  PrismaService,
} from '@workspaces/data-access';

@Module({
  controllers: [ConsultZipcodeController],
  providers: [
    ConsultZipcodeService,
    ConsultZipcode,
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
    {
      provide: 'FindUserByIdRepository',
      useClass: FindUserByIdRepositoryImpl,
    },
    {
      provide: 'ConsultZipcodeRepository',
      useClass: ConsultZipcodeRepositoryImpl,
    },
  ],
})
export class ConsultZipcodeModule {}
