import { Controller, Get, Query } from '@nestjs/common';
import { ListSimpleStateService } from './list-simple-state.service';
import { ErrorMessageResult } from '@workspaces/domain';

@Controller('list-simple-state')
export class ListSimpleStateController {
  constructor(
    private readonly listSimpleStateService: ListSimpleStateService
  ) {}

  @Get()
  async list(
    @Query('countryId') countryId: string,
    @Query('loggedUserId') loggedUserId: string
  ) {
    const result = await this.listSimpleStateService.list({
      countryId,
      loggedUserId,
    });

    if (result.isRight()) return result.value;
    else await ErrorMessageResult(result.value.name, result.value.message);
  }
}
