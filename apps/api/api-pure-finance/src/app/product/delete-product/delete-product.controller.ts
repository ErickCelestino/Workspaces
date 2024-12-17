import { Controller, Delete, Param, Query } from '@nestjs/common';
import { ErrorMessageResult } from '@workspaces/domain';
import { DeleteProductService } from './delete-product.service';

@Controller('delete-product')
export class DeleteProductController {
  constructor(private readonly deleteProductService: DeleteProductService) {}

  @Delete(':productId')
  //@UsePipes(new ZodValidationPipe(deleteCompanyByIdSchema))
  async delete(
    @Query('loggedUserId') loggedUserId: string,
    @Param('productId') productId: string
  ) {
    const result = await this.deleteProductService.delete({
      id: productId ?? '',
      loggedUserId: loggedUserId ?? '',
    });

    if (result.isRight()) return { productId: result.value };
    else await ErrorMessageResult(result.value.name, result.value.message);
  }
}
