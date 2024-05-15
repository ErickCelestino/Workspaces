import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { ListUserService } from './list-user.service';

@Controller('list-user')
export class ListUserController {
  constructor(private readonly listUserService: ListUserService) {}

  @Get()
  async getListUsers(
    @Query('filter') input: string,
    @Query('skip') skip: number,
    @Query('take') take: number
  ) {
    const result = await this.listUserService.list({ input, skip, take });

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
