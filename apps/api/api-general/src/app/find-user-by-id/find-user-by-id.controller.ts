import {
  BadRequestException,
  Controller,
  Get,
  Param,
  UsePipes,
} from '@nestjs/common';
import { FindUserByIdService } from './find-user-by-id.service';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { findUserByIdSchema } from '@workspaces/domain';

@Controller('find-user-by-id')
export class FindUserByIdController {
  constructor(private readonly findUserByIdService: FindUserByIdService) {}

  @UsePipes(new ZodValidationPipe(findUserByIdSchema))
  @Get(':id')
  async create(@Param('id') id: string) {
    const result = await this.findUserByIdService.find(id);

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
