import { Module } from '@nestjs/common';

import { CreateProductController } from './create-product.controller';
import {
  CreateProductRepositoryImpl,
  FindProductByNameRepositoryImpl,
  FindUserByIdRepositoryImpl,
  PrismaGeneralService,
} from '@workspaces/data-access';
import { CreateProductService } from './create-product.service';
import { CreateProduct } from '@workspaces/domain';

@Module({
  imports: [],
  controllers: [CreateProductController],
  providers: [
    CreateProduct,
    CreateProductService,
    {
      provide: 'PrismaService',
      useClass: PrismaGeneralService,
    },
    {
      provide: 'FindUserByIdRepository',
      useClass: FindUserByIdRepositoryImpl,
    },
    {
      provide: 'FindProductByNameRespository',
      useClass: FindProductByNameRepositoryImpl,
    },
    {
      provide: 'CreateProductRepository',
      useClass: CreateProductRepositoryImpl,
    },
  ],
})
export class CreateProductModule {}
