import { Controller, Get, Query } from '@nestjs/common';
import { ListProductService } from './list-product.service';
import { ErrorMessageResult } from '@workspaces/domain';

@Controller('list-product')
export class ListProductController {
  constructor(private readonly listProductService: ListProductService) {}

  @Get()
  //@UsePipes(new ZodValidationPipe(lisCompanySchema))
  async list(
    @Query('filter') filter: string,
    @Query('loggedUserId') loggedUserId: string,
    @Query('take') take: string,
    @Query('skip') skip: string
  ) {
    const result = await this.listProductService.list({
      filter: filter ?? '',
      loggedUserId: loggedUserId ?? '',
      take: parseInt(take),
      skip: parseInt(skip),
    });

    if (result.isRight()) return result.value;
    else await ErrorMessageResult(result.value.name, result.value.message);
  }
}
