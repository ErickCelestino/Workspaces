import { Body, Controller, Param, Put, Query } from '@nestjs/common';
import { ErrorMessageResult } from '@workspaces/domain';
import { ChangeProductStatusService } from './change-product-status.service';

@Controller('change-product-status')
export class ChangeProductStatusController {
  constructor(
    private readonly changeProductStatusService: ChangeProductStatusService
  ) {}

  @Put(':productId')
  //@UsePipes(new ZodValidationPipe(createProductSchema))
  async change(
    @Query('loggedUserId') loggedUserId: string,
    @Param('productId') productId: string,
    @Body() body: { status: string }
  ) {
    const result = await this.changeProductStatusService.change({
      id: productId ?? '',
      status: body.status ?? '',
      loggedUserId: loggedUserId ?? '',
    });

    if (result.isRight()) return { productId: result.value };
    else await ErrorMessageResult(result.value.name, result.value.message);
  }
}
