import { Controller, Delete, Param, Query } from '@nestjs/common';
import { DeleteDeviceService } from './delete-device.service';
import { ErrorMessageResult } from '@workspaces/domain';

@Controller('delete-device')
export class DeleteDeviceController {
  constructor(private readonly deleteDeviceService: DeleteDeviceService) {}

  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @Query('loggedUserId') loggedUserId: string
  ) {
    const result = await this.deleteDeviceService.delete({
      id,
      loggedUserId,
    });

    if (result.isRight()) return result.value;
    else await ErrorMessageResult(result.value.name, result.value.message);
  }
}
