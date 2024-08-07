import { Controller, Get, Param, Query } from '@nestjs/common';
import { FindSchedulesByDeviceIdService } from './find-schedules-by-device-id.service';
import { ErrorMessageResult } from '@workspaces/domain';

@Controller('find-schedules-by-device-id')
export class FindSchedulesByDeviceIdController {
  constructor(
    private readonly findSchedulesByDeviceIdService: FindSchedulesByDeviceIdService
  ) {}

  @Get(':id')
  async find(
    @Param('id') idDevice: string,
    @Query('loggedUserId') loggedUserId: string
  ) {
    const result = await this.findSchedulesByDeviceIdService.find({
      idDevice,
      loggedUserId,
    });

    if (result.isRight()) return result.value;
    else await ErrorMessageResult(result.value.name, result.value.message);
  }
}
