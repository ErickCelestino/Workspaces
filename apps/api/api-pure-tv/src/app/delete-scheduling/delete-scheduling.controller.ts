import { Controller, Delete, Param, Query } from '@nestjs/common';
import { DeleteSchedulingService } from './delete-scheduling.service';
import { ErrorMessageResult } from '@workspaces/domain';

@Controller('delete-scheduling')
export class DeleteSchedulingController {
  constructor(
    private readonly deleteSchedulingService: DeleteSchedulingService
  ) {}

  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @Query('loggedUserId') loggedUserId: string
  ) {
    const result = await this.deleteSchedulingService.delete({
      id,
      loggedUserId,
    });

    if (result.isRight()) return result.value;
    else await ErrorMessageResult(result.value.name, result.value.message);
  }
}
