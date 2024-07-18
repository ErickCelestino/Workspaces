import { Body, Controller, Post, Query } from '@nestjs/common';
import { CreateSchedulingService } from './create-scheduling.service';
import {
  CreateSchedulingBodyDto,
  CreateSchedulingResponseDto,
  ErrorMessageResult,
} from '@workspaces/domain';

@Controller('create-scheduling')
export class CreateSchedulingController {
  constructor(
    private readonly createSchedulingService: CreateSchedulingService
  ) {}

  @Post()
  async create(
    @Query('loggedUserId') loggedUserId: string,
    @Body() body: CreateSchedulingBodyDto
  ) {
    const result = await this.createSchedulingService.create({
      body,
      loggedUserId,
    });

    const response: CreateSchedulingResponseDto = {
      schedulingId: `${result.value}`,
    };

    if (result.isRight()) return response;
    else await ErrorMessageResult(result.value.name, result.value.message);
  }
}
