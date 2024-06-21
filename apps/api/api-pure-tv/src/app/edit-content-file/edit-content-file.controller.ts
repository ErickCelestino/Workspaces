import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Put,
  Query,
} from '@nestjs/common';
import { EditContentFileService } from './edit-content-file.service';
import { EditContentFileDto } from '@workspaces/domain';
import { z } from 'zod';

@Controller('edit-content-file')
export class EditContentFileController {
  constructor(
    private readonly editContentFileService: EditContentFileService
  ) {}

  private createStringSchema() {
    return z.string().min(1);
  }

  @Put(':id')
  async edit(
    @Param('id') idToEdit: string,
    @Query('loggedUserId') loggedUserId: string,
    @Query('directoryId') directoryId: string,
    @Body() input: { newFileName: string }
  ) {
    const dto: EditContentFileDto = {
      directoryId,
      loggedUserId,
      idToEdit,
      newFileName: input.newFileName,
    };

    const result = await this.editContentFileService.edit(dto);
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
