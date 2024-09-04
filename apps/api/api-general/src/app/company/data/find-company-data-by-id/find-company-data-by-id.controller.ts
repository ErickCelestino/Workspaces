import { Controller, Get, Param, Query } from '@nestjs/common';
import { FindCompanyDataByIdService } from './find-company-data-by-id.service';
import { ErrorMessageResult } from '@workspaces/domain';

@Controller('find-company-data-by-id')
export class FindCompanyDataByIdController {
  constructor(
    private readonly findCompanyDataByIdService: FindCompanyDataByIdService
  ) {}

  @Get(':companyDataId')
  async find(
    @Param('companyDataId') companyDataId: string,
    @Query('loggedUserId') loggedUserId: string
  ) {
    const result = await this.findCompanyDataByIdService.find({
      companyDataId,
      loggedUserId,
    });

    if (result.isRight()) return result.value;
    else await ErrorMessageResult(result.value.name, result.value.message);
  }
}
