import { Controller, Param, Post, Query } from '@nestjs/common';
import { AddUserToAnotherCompanyService } from './add-user-to-another-company.service';
import { ErrorMessageResult } from '@workspaces/domain';

@Controller('add-user-to-another-company')
export class AddUserToAnotherCompanyController {
  constructor(
    private readonly addUserToAnotherCompanyService: AddUserToAnotherCompanyService
  ) {}

  @Post(':userId')
  async add(
    @Param('userId') userId: string,
    @Query('loggedUserId') loggedUserId: string,
    @Query('companyId') companyId: string
  ) {
    const result = await this.addUserToAnotherCompanyService.add({
      companyId,
      loggedUserId,
      userId,
    });

    if (result.isRight()) return { companyId: result.value };
    else await ErrorMessageResult(result.value.name, result.value.message);
  }
}
