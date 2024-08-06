import { Controller, Get, Param, Query } from '@nestjs/common';
import { FindDeviceByIdService } from './find-device-by-id.service';
import { ErrorMessageResult } from '@workspaces/domain';

@Controller('find-device-by-id')
export class FindDeviceByIdController {
  constructor(private readonly findDeviceByIdService: FindDeviceByIdService) {}

  @Get(':id')
  async find(
    @Param('id') id: string,
    @Query('loggedUserId') loggedUserId: string
  ) {
    const result = await this.findDeviceByIdService.find({
      id,
      loggedUserId,
    });

    if (result.isRight()) return { deviceId: result.value };
    else await ErrorMessageResult(result.value.name, result.value.message);
  }
}
