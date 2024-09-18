import { Controller, Get, Param, Query } from '@nestjs/common';
import { ListUsersByCompanyIdService } from './list-users-by-company-id.service';
import { ErrorMessageResult } from '@workspaces/domain';

@Controller('list-users-by-company-id')
export class ListUsersByCompanyIdController {
  constructor(
    private readonly listUsersByCompanyIdService: ListUsersByCompanyIdService
  ) {}

  @Get(':companyId')
  async list(
    @Param('companyId') companyId: string,
    @Query('loggedUserId') loggedUserId: string,
    @Query('take') take: string,
    @Query('skip') skip: string,
    @Query('filter') filter: string
  ) {
    const result = await this.listUsersByCompanyIdService.list({
      companyId,
      filter,
      loggedUserId,
      take: parseInt(take),
      skip: parseInt(skip),
    });

    if (result.isRight()) return result.value;
    else await ErrorMessageResult(result.value.name, result.value.message);
  }
}
