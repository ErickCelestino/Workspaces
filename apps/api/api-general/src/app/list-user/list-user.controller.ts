import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { ListUserService } from './list-user.service';

@Controller('list-user')
export class ListUserController {
  constructor(private readonly listUserService: ListUserService) {}

  @Get()
  async getListUsers(@Query('filter') input: string) {
    const result = await this.listUserService.list(input);

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
