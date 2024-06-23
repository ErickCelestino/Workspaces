import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Param,
  Query,
  UsePipes,
} from '@nestjs/common';
import { DeleteUserByIdService } from './delete-user-by-id.service';
import { DeleteUserByIdDto, deleteUserByIdSchema } from '@workspaces/domain';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';

@Controller('delete-user-by-id')
export class DeleteUserByIdController {
  constructor(private readonly deleteUserByIdService: DeleteUserByIdService) {}

  @UsePipes(new ZodValidationPipe(deleteUserByIdSchema))
  @Delete(':id')
  async edit(
    @Body() input: { description: string },
    @Param('id') idToDelete: string,
    @Query('loggedUserId') loggedUser: string
  ) {
    const dto: DeleteUserByIdDto = {
      description: input.description,
      id: idToDelete,
      loggedUser,
    };
    const result = await this.deleteUserByIdService.delete(dto);

    if (result.isRight()) return;
    else
      throw new BadRequestException({
        error: {
          name: result.value.name,
          message: result.value.message,
        },
      });
  }
}
