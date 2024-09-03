import { Body, Controller, Param, Put, Query } from '@nestjs/common';
import { EditCompanyDataService } from './edit-company-data.service';
import { CompanyDataBodyDto, ErrorMessageResult } from '@workspaces/domain';

@Controller('edit-company-data')
export class EditCompanyDataController {
  constructor(
    private readonly editCompanyDataService: EditCompanyDataService
  ) {}

  @Put(':companyDataId')
  async edit(
    @Query('loggedUserId') loggedUserId: string,
    @Param('companyDataId') companyDataId: string,
    @Body() body: CompanyDataBodyDto
  ) {
    const result = await this.editCompanyDataService.edit({
      body: body?.legalNature.length < 1 ? ({} as CompanyDataBodyDto) : body,
      companyDataId,
      loggedUserId,
    });

    if (result.isRight()) return { companyDataId: result.value };
    else await ErrorMessageResult(result.value.name, result.value.message);
  }
}
