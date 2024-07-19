import { Controller, Get, Query } from '@nestjs/common';
import { ListSchedulingService } from './list-scheduling.service';
import { ErrorMessageResult } from '@workspaces/domain';

@Controller('list-scheduling')
export class ListSchedulingController {
  constructor(private readonly listSchedulingService: ListSchedulingService) {}

  @Get()
  async list(
    @Query('filter') filter: string,
    @Query('skip') skip: number,
    @Query('take') take: number,
    @Query('loggedUserId') loggedUserId: string
  ) {
    const result = await this.listSchedulingService.list({
      loggedUserId,
      filter,
      skip,
      take,
    });

    if (result.isRight()) return result.value;
    else await ErrorMessageResult(result.value.name, result.value.message);
  }
}
