import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Query,
  UsePipes,
} from '@nestjs/common';
import { DeleteUserByIdService } from './delete-user-by-id.service';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { DeleteUserByIdDto, deleteUserByIdSchema } from '@workspaces/domain';

@Controller('delete-user-by-id')
export class DeleteUserByIdController {
  constructor(private readonly deleteUserByIdService: DeleteUserByIdService) {}

  @Delete()
  @UsePipes(new ZodValidationPipe(deleteUserByIdSchema))
  async edit(@Body() input: DeleteUserByIdDto) {
    const result = await this.deleteUserByIdService.delete(input);

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
