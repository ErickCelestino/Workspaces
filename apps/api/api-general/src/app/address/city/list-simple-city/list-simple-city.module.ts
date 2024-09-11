import { Module } from '@nestjs/common';
import { ListSimpleCityService } from './list-simple-city.service';
import { ListSimpleCityController } from './list-simple-city.controller';
import { ListSimpleCity } from '@workspaces/domain';
import {
  FindStateByIdRepositoryImpl,
  FindUserByIdRepositoryImpl,
  ListSimpleCityRepositoryImpl,
  PrismaService,
} from '@workspaces/data-access';

@Module({
  controllers: [ListSimpleCityController],
  providers: [
    ListSimpleCityService,
    ListSimpleCity,
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
    {
      provide: 'FindUserByIdRepository',
      useClass: FindUserByIdRepositoryImpl,
    },
    {
      provide: 'FindStateByIdRepository',
      useClass: FindStateByIdRepositoryImpl,
    },
    {
      provide: 'ListSimpleCityRepository',
      useClass: ListSimpleCityRepositoryImpl,
    },
  ],
})
export class ListSimpleCityModule {}
