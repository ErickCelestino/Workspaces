import { Controller, Get, Param, Query } from '@nestjs/common';
import { FindCompanyResponsibleByIdService } from './find-company-responsible-by-id.service';
import { ErrorMessageResult } from '@workspaces/domain';

@Controller('find-company-responsible-by-id')
export class FindCompanyResponsibleByIdController {
  constructor(
    private readonly findCompanyResponsibleByIdService: FindCompanyResponsibleByIdService
  ) {}

  @Get(':companyResponsibleId')
  async find(
    @Query('loggedUserId') loggedUserId: string,
    @Param('companyResponsibleId') companyResponsibleId: string
  ) {
    const result = await this.findCompanyResponsibleByIdService.find({
      companyResponsibleId: companyResponsibleId ?? '',
      loggedUserId: loggedUserId ?? '',
    });

    if (result.isRight()) return result.value;
    else await ErrorMessageResult(result.value.name, result.value.message);
  }
}