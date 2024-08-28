import { Controller, Get, Query } from '@nestjs/common';
import { ListSimpleCountryService } from './list-simple-country.service';
import { ErrorMessageResult } from '@workspaces/domain';

@Controller('list-simple-country')
export class ListSimpleCountryController {
  constructor(
    private readonly listSimpleCountryService: ListSimpleCountryService
  ) {}

  @Get()
  async list(@Query('loggedUserId') loggedUserId: string) {
    const result = await this.listSimpleCountryService.list({ loggedUserId });

    if (result.isRight()) return result.value;
    else await ErrorMessageResult(result.value.name, result.value.message);
  }
}
