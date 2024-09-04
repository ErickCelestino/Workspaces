import { Controller, Get, Param, Query } from '@nestjs/common';
import { FindAllCompanyIdsService } from './find-all-company-ids.service';
import { ErrorMessageResult } from '@workspaces/domain';

@Controller('find-all-company-ids')
export class FindAllCompanyIdsController {
  constructor(
    private readonly findAllCompanyIdsService: FindAllCompanyIdsService
  ) {}

  @Get(':companyId')
  async find(
    @Query('loggedUserId') loggedUserId: string,
    @Param('companyId') companyId: string
  ) {
    const result = await this.findAllCompanyIdsService.find({
      companyId,
      loggedUserId,
    });

    if (result.isRight()) return result.value;
    else await ErrorMessageResult(result.value.name, result.value.message);
  }
}
