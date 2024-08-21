import { Controller, Get, Param, Query } from '@nestjs/common';
import { ConsultCompanyByCnpjService } from './consult-company-by-cnpj.service';
import { ErrorMessageResult } from '@workspaces/domain';

@Controller('consult-company-by-cnpj')
export class ConsultCompanyByCnpjController {
  constructor(
    private readonly consultCompanyByCnpjService: ConsultCompanyByCnpjService
  ) {}

  @Get(':cnpj')
  async consult(
    @Param('cnpj') cnpj: string,
    @Query('loggedUserId') loggedUserId: string
  ) {
    const result = await this.consultCompanyByCnpjService.consult({
      cnpj,
      loggedUserId,
    });

    if (result.isRight()) return result.value;
    else await ErrorMessageResult(result.value.name, result.value.message);
  }
}
