import { Body, Controller, Delete, Param, Query } from '@nestjs/common';
import { DeleteCompanyByIdService } from './delete-company-by-id.service';
import { ErrorMessageResult } from '@workspaces/domain';

@Controller('delete-company-by-id')
export class DeleteCompanyByIdController {
  constructor(
    private readonly deleteCompanyByIdService: DeleteCompanyByIdService
  ) {}

  @Delete(':companyId')
  async delete(
    @Query('loggedUserId') loggedUserId: string,
    @Param('companyId') companyId: string,
    @Body() body: { description: string }
  ) {
    const result = await this.deleteCompanyByIdService.delete({
      companyId: companyId,
      description: body.description,
      loggedUserId: loggedUserId,
    });

    if (result.isRight()) return { companyAddressId: result.value };
    else await ErrorMessageResult(result.value.name, result.value.message);
  }
}
