import {
  BadRequestException,
  Body,
  Controller,
  Get,
  UsePipes,
} from '@nestjs/common';
import { ListUserService } from './list-user.service';
import { ListUserDto } from '@workspaces/domain';

@Controller('list-user')
export class ListUserController {
  constructor(private readonly listUserService: ListUserService) {}

  @Get()
  async getListUsers(@Body() input: ListUserDto) {
    const result = await this.listUserService.list(input.input.toString());

    if (result.isRight()) return result;
    else
      throw new BadRequestException({
        error: {
          name: result.value.name,
          message: result.value.message,
        },
      });
  }
}
