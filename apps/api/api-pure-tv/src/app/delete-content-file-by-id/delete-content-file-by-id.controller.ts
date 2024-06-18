import {
  BadRequestException,
  Controller,
  Delete,
  Param,
  Query,
} from '@nestjs/common';
import { DeleteContentFileByIdService } from './delete-content-file-by-id.service';
import { DeleteContentFileByIdDto } from '@workspaces/domain';

@Controller('delete-content-file-by-id')
export class DeleteContentFileByIdController {
  constructor(
    private readonly deleteContentFileByIdService: DeleteContentFileByIdService
  ) {}

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
