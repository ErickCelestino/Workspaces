import { Body, Controller, Post, Query } from '@nestjs/common';
import { AddSchedulesToDeviceService } from './add-schedules-to-device.service';
import { ErrorMessageResult } from '@workspaces/domain';

@Controller('add-schedules-to-device')
export class AddSchedulesToDeviceController {
  constructor(
    private readonly addSchedulesToDeviceService: AddSchedulesToDeviceService
  ) {}

  @Post()
  async add(
    @Query('loggedUserId') loggedUserId: string,
    @Query('idDevice') idDevice: string,
    @Body() body: { schedulesIds: string[] }
  ) {
    const result = await this.addSchedulesToDeviceService.add({
      idDevice,
      loggedUserId,
      schedulesIds: body.schedulesIds ?? [],
    });

    if (result.isRight()) return { ids: result.value };
    else await ErrorMessageResult(result.value.name, result.value.message);
  }
}
