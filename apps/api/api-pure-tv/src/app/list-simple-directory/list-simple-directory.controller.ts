import { Controller, Get, Query } from '@nestjs/common';
import { ListSimpleDirectoryService } from './list-simple-directory.service';
import { ErrorMessageResult } from '@workspaces/domain';

@Controller('list-simple-directory')
export class ListSimpleDirectoryController {
  constructor(
    private readonly listSimpleDirectoryService: ListSimpleDirectoryService
  ) {}

  @Get()
  async list(
    @Query('filter') filter: string,
    @Query('skip') skip: number,
    @Query('take') take: number,
    @Query('loggedUserId') loggedUserId: string
  ) {
    const result = await this.listSimpleDirectoryService.list({
      loggedUserId,
      userInput: filter,
      skip,
      take,
    });

    if (result.isRight()) return result.value;
    else ErrorMessageResult(result.value.name, result.value.message);
  }
}
