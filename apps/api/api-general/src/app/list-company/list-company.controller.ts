import { Controller, Get, Query } from '@nestjs/common';
import { ListCompanyService } from './list-company.service';
import { ErrorMessageResult } from '@workspaces/domain';

@Controller('list-company')
export class ListCompanyController {
  constructor(private readonly listCompanyService: ListCompanyService) {}

  @Get()
  async list(
    @Query('filter') filter: string,
    @Query('loggedUserId') loggedUserId: string,
    @Query('take') take: string,
    @Query('skip') skip: string
  ) {
    const result = await this.listCompanyService.list({
      filter: filter ?? '',
      loggedUserId: loggedUserId ?? '',
      take: parseInt(take),
      skip: parseInt(skip),
    });

    if (result.isRight()) return result.value;
    else await ErrorMessageResult(result.value.name, result.value.message);
  }
}
