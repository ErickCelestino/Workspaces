import { Body, Controller, Param, Put, Query, UsePipes } from '@nestjs/common';
import { EditSchedulingService } from './edit-scheduling.service';
import {
  EditSchedulingBodyDto,
  editSchedulingSchema,
  ErrorMessageResult,
} from '@workspaces/domain';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';

@Controller('edit-scheduling')
export class EditSchedulingController {
  constructor(private readonly editSchedulingService: EditSchedulingService) {}

  @UsePipes(new ZodValidationPipe(editSchedulingSchema))
  @Put(':id')
  async edit(
    @Param('id') id: string,
    @Query('loggedUserId') loggedUserId: string,
    @Body() body: EditSchedulingBodyDto
  ) {
    const result = await this.editSchedulingService.edit({
      body,
      id,
      loggedUserId,
    });

    if (result.isRight()) return result.value;
    else await ErrorMessageResult(result.value.name, result.value.message);
  }
}