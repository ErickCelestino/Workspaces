import { Controller, Get, Query } from '@nestjs/common';
import { ListDeviceService } from './list-device.service';
import { ErrorMessageResult } from '@workspaces/domain';

@Controller('list-device')
export class ListDeviceController {
  constructor(private readonly listDeviceService: ListDeviceService) {}

  @Get()
  async list(
    @Query('filter') filter: string,
    @Query('skip') skip: number,
    @Query('take') take: number,
    @Query('loggedUserId') loggedUserId: string
  ) {
    const result = await this.listDeviceService.list({
      loggedUserId,
      filter,
      skip,
      take,
    });

    if (result.isRight()) return result.value;
    else await ErrorMessageResult(result.value.name, result.value.message);
  }
}
