import { Body, Controller, Post, Query } from '@nestjs/common';
import { CreateCompanyService } from './create-company.service';
import { BodyCompanyDto, ErrorMessageResult } from '@workspaces/domain';

@Controller('create-company')
export class CreateCompanyController {
  constructor(private readonly createCompanyService: CreateCompanyService) {}

  @Post()
  async create(
    @Body() body: BodyCompanyDto,
    @Query('loggedUserId') loggedUserId: string
  ) {
    const result = await this.createCompanyService.create({
      body,
      loggedUserId,
    });

    if (result.isRight()) return { companyId: result.value };
    else await ErrorMessageResult(result.value.name, result.value.message);
  }
}
