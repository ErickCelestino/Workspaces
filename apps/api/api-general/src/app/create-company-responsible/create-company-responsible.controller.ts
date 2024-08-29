import { Body, Controller, Post, Query } from '@nestjs/common';
import { CreateCompanyResponsibleService } from './create-company-responsible.service';
import {
  CompanyBodyResponsibleDto,
  ErrorMessageResult,
} from '@workspaces/domain';

@Controller('create-company-responsible')
export class CreateCompanyResponsibleController {
  constructor(
    private readonly createCompanyResponsibleService: CreateCompanyResponsibleService
  ) {}

  @Post()
  async create(
    @Query('loggedUserId') loggedUserId: string,
    @Query('companyId') companyId: string,
    @Body() body: CompanyBodyResponsibleDto
  ) {
    const result = await this.createCompanyResponsibleService.create({
      body: body ?? {},
      companyId: companyId ?? '',
      loggedUserId: loggedUserId ?? '',
    });

    if (result.isRight()) return { companyResponsibleId: result.value };
    else await ErrorMessageResult(result.value.name, result.value.message);
  }
}
