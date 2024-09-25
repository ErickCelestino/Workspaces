import { Controller, Delete, Param, Query } from '@nestjs/common';
import { UnauthorizeUserToCompanyService } from './unauthorize-user-to-company.service';
import { ErrorMessageResult } from '@workspaces/domain';

@Controller('unauthorize-user-to-company')
export class UnauthorizeUserToCompanyController {
  constructor(
    private readonly unauthorizeUserToCompanyService: UnauthorizeUserToCompanyService
  ) {}

  @Delete(':userId')
  async auth(
    @Param('userId') userId: string,
    @Query('loggedUserId') loggedUserId: string,
    @Query('companyId') companyId: string
  ) {
    const result = await this.unauthorizeUserToCompanyService.auth({
      companyId,
      loggedUserId,
      userId,
    });

    if (result.isRight()) return { companyId: result.value };
    else await ErrorMessageResult(result.value.name, result.value.message);
  }
}
