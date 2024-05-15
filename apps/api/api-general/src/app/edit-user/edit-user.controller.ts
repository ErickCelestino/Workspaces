import {
  BadRequestException,
  Body,
  Controller,
  Put,
  UsePipes,
} from '@nestjs/common';
import { EditUserService } from './edit-user.service';
import { EditUserDto, editUserSchema } from '@workspaces/domain';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';

@Controller('edit-user')
export class EditUserController {
  constructor(private readonly editUserService: EditUserService) {}

  @Put()
  @UsePipes(new ZodValidationPipe(editUserSchema))
  async create(@Body() input: EditUserDto) {
    const result = await this.editUserService.edit(input);

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
