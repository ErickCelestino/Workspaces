import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
import { FindUserByIdService } from './find-user-by-id.service';

@Controller('find-user-by-id')
export class FindUserByIdController {
  constructor(private readonly findUserByIdService: FindUserByIdService) {}
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
