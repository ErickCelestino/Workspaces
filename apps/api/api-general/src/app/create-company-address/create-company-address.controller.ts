import { Body, Controller, Post, Query } from '@nestjs/common';
import { CreateCompanyAddressService } from './create-company-address.service';
import { CompanyBodyAddressDto, ErrorMessageResult } from '@workspaces/domain';

@Controller('create-company-address')
export class CreateCompanyAddressController {
  constructor(
    private readonly createCompanyAddressService: CreateCompanyAddressService
  ) {}

  @Post()
  async create(
    @Query('loggedUserId') loggedUserId: string,
    @Query('companyId') companyId: string,
    @Body() body: CompanyBodyAddressDto
  ) {
    const result = await this.createCompanyAddressService.create({
      body: body?.cityId.length > 0 ? body : ({} as CompanyBodyAddressDto),
      companyId: companyId ?? '',
      loggedUserId: loggedUserId ?? '',
    });

    if (result.isRight()) return { companyAddressId: result.value };
    else await ErrorMessageResult(result.value.name, result.value.message);
  }
}
