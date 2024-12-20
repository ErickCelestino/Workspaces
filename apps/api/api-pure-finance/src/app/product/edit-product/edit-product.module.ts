import { Module } from '@nestjs/common';
import {
  EditProductRepositoryImpl,
  FindProductByIdRepositoryImpl,
  FindUserByIdRepositoryImpl,
  PrismaGeneralService,
} from '@workspaces/data-access';

import { EditProduct } from '@workspaces/domain';
import { EditProductController } from './edit-product.controller';
import { EditProductService } from './edit-product.service';

@Module({
  imports: [],
  controllers: [EditProductController],
  providers: [
    EditProduct,
    EditProductService,
    {
      provide: 'PrismaService',
      useClass: PrismaGeneralService,
    },
    {
      provide: 'FindUserByIdRepository',
      useClass: FindUserByIdRepositoryImpl,
    },
    {
      provide: 'FindProductByIdRepository',
      useClass: FindProductByIdRepositoryImpl,
    },
    {
      provide: 'EditProductRepository',
      useClass: EditProductRepositoryImpl,
    },
  ],
})
export class EditProductModule {}
