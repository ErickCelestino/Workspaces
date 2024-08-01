import { Body, Controller, Post, Query } from '@nestjs/common';
import { CreateDeviceService } from './create-device.service';
import { ErrorMessageResult } from '@workspaces/domain';

@Controller('create-device')
export class CreateDeviceController {
  constructor(private readonly createDeviceService: CreateDeviceService) {}

  @Post()
  async create(
    @Query('loggedUserId') loggedUserId: string,
    @Body() body: { name: string }
  ) {
    const result = await this.createDeviceService.create({
      loggedUserId,
      body: body,
    });

    if (result.isRight()) return { deviceId: result.value };
    else await ErrorMessageResult(result.value.name, result.value.message);
  }
}
