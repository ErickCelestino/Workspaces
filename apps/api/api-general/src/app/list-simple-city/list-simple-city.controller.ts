import { Controller, Get, Query } from '@nestjs/common';
import { ListSimpleCityService } from './list-simple-city.service';
import { ErrorMessageResult } from '@workspaces/domain';

@Controller('list-simple-city')
export class ListSimpleCityController {
  constructor(private readonly listSimpleCityService: ListSimpleCityService) {}

  @Get()
  async list(
    @Query('loggedUserId') loggedUserId: string,
    @Query('stateId') stateId: string
  ) {
    const result = await this.listSimpleCityService.list({
      loggedUserId,
      stateId,
    });

    if (result.isRight()) return result.value;
    else await ErrorMessageResult(result.value.name, result.value.message);
  }
}
