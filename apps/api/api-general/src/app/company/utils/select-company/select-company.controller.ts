import { Controller, Param, Post, Query } from '@nestjs/common';
import { SelectCompanyService } from './select-company.service';
import { ErrorMessageResult } from '@workspaces/domain';

@Controller('select-company')
export class SelectCompanyController {
  constructor(private readonly selectCompanyService: SelectCompanyService) {}

  @Post(':companyId')
  async select(
    @Query('loggedUserId') loggedUserId: string,
    @Param('companyId') companyId: string
  ) {
    const result = await this.selectCompanyService.select({
      companyId,
      loggedUserId,
    });

    if (result.isRight()) return { companyId: result.value };
    else await ErrorMessageResult(result.value.name, result.value.message);
  }
}
