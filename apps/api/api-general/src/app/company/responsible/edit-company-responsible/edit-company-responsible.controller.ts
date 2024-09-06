import { Body, Controller, Param, Put, Query } from '@nestjs/common';
import { EditCompanyResponsibleService } from './edit-company-responsible.service';
import {
  CompanyBodyResponsibleDto,
  ErrorMessageResult,
} from '@workspaces/domain';

@Controller('edit-company-responsible')
export class EditCompanyResponsibleController {
  constructor(
    private readonly editCompanyResponsibleService: EditCompanyResponsibleService
  ) {}

  @Put(':companyResponsibleId')
  async edit(
    @Query('loggedUserId') loggedUserId: string,
    @Param('companyResponsibleId') companyResponsibleId: string,
    @Body() body: Omit<CompanyBodyResponsibleDto, 'document'>
  ) {
    const result = await this.editCompanyResponsibleService.edit({
      body: body ?? {},
      companyResponsibleId: companyResponsibleId ?? '',
      loggedUserId: loggedUserId ?? '',
    });

    if (result.isRight()) return { companyResponsibleId: result.value };
    else await ErrorMessageResult(result.value.name, result.value.message);
  }
}
