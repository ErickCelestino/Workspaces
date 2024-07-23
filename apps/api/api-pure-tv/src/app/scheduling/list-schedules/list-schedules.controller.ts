import { Controller, Get, Query, UsePipes } from '@nestjs/common';
import { ListSchedulesService } from './list-schedules.service';
import { ErrorMessageResult, listSchedulesSchema } from '@workspaces/domain';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';

@Controller('list-schedules')
export class ListSchedulesController {
  constructor(private readonly listSchedulesService: ListSchedulesService) {}

  @UsePipes(new ZodValidationPipe(listSchedulesSchema))
  @Get()
  async list(
    @Query('filter') filter: string,
    @Query('skip') skip: number,
    @Query('take') take: number,
    @Query('loggedUserId') loggedUserId: string
  ) {
    const result = await this.listSchedulesService.list({
      loggedUserId,
      filter,
      skip,
      take,
    });

    if (result.isRight()) return result.value;
    else await ErrorMessageResult(result.value.name, result.value.message);
  }
}