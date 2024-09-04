import { Body, Controller, Param, Put, Query } from '@nestjs/common';
import { EditCompanyAddressService } from './edit-company-address.service';
import { CompanyBodyAddressDto, ErrorMessageResult } from '@workspaces/domain';

@Controller('edit-company-address')
export class EditCompanyAddressController {
  constructor(
    private readonly editCompanyAddressService: EditCompanyAddressService
  ) {}

  @Put(':companyAddressId')
  async edit(
    @Query('loggedUserId') loggedUserId: string,
    @Param('companyAddressId') companyAddressId: string,
    @Body() body: CompanyBodyAddressDto
  ) {
    const result = await this.editCompanyAddressService.edit({
      body: body?.cityId.length > 0 ? body : ({} as CompanyBodyAddressDto),
      companyAddressId: companyAddressId ?? '',
      loggedUserId: loggedUserId ?? '',
    });

    if (result.isRight()) return { companyAddressId: result.value };
    else await ErrorMessageResult(result.value.name, result.value.message);
  }
}
