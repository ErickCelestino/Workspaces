import {
  BadRequestException,
  Controller,
  Delete,
  Param,
  Query,
  UsePipes,
} from '@nestjs/common';
import { DeleteContentFileByIdService } from './delete-content-file-by-id.service';
import {
  DeleteContentFileByIdDto,
  deleteContentFileByIdSchema,
} from '@workspaces/domain';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';

@Controller('delete-content-file-by-id')
export class DeleteContentFileByIdController {
  constructor(
    private readonly deleteContentFileByIdService: DeleteContentFileByIdService
  ) {}

  @UsePipes(
    new ZodValidationPipe({
      id: deleteContentFileByIdSchema.id,
      loggedUserId: deleteContentFileByIdSchema.loggedUserId,
      directoryId: deleteContentFileByIdSchema.directoryId,
    })
  )
  @Delete(':id')
  async delete(
    @Param('id') idToDelete: string,
    @Query('loggedUserId') loggedUserId: string,
    @Query('directoryId') directoryId: string
  ) {
    const dto: DeleteContentFileByIdDto = {
      directoryId,
      loggedUserId,
      idToDelete,
    };
    const result = await this.deleteContentFileByIdService.delete(dto);

    if (result.isRight()) return result.value;
    else
      throw new BadRequestException({
        error: {
          name: result.value.name,
          message: result.value.message,
        },
      });
  }
}
