import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Put,
  Query,
  UsePipes,
} from '@nestjs/common';
import { EditContentFileService } from './edit-content-file.service';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { EditContentFileDto, editFileSchema } from '@workspaces/domain';

@Controller('edit-content-file')
export class EditContentFileController {
  constructor(
    private readonly editContentFileService: EditContentFileService
  ) {}

  @UsePipes(
    new ZodValidationPipe({
      id: editFileSchema.id,
      loggedUserId: editFileSchema.loggedUserId,
      directoryId: editFileSchema.directoryId,
      newFileName: editFileSchema.newFileName,
    })
  )
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
