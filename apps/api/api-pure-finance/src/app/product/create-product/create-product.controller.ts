import { Body, Controller, Post, Query } from '@nestjs/common';
import { CreateProductService } from './create-product.service';
import { ErrorMessageResult, ProductBodyDto } from '@workspaces/domain';

@Controller('create-product')
export class CreateProductController {
  constructor(private readonly createProductService: CreateProductService) {}

  @Post()
  // @UsePipes(new ZodValidationPipe(createUserSchema))
  async create(
    @Query('loggedUserId') loggedUserId: string,
    @Body() body: ProductBodyDto
  ) {
    const result = await this.createProductService.create({
      body: body ?? ({} as ProductBodyDto),
      loggedUserId: loggedUserId ?? '',
    });

    if (result.isRight()) return { productId: result.value };
    else await ErrorMessageResult(result.value.name, result.value.message);
  }
}
