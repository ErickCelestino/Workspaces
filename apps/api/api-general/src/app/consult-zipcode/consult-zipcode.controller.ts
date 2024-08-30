import { Controller, Get, Param, Query } from '@nestjs/common';
import { ConsultZipcodeService } from './consult-zipcode.service';
import { ErrorMessageResult } from '@workspaces/domain';

@Controller('consult-zipcode')
export class ConsultZipcodeController {
  constructor(private readonly consultZipcodeService: ConsultZipcodeService) {}

  @Get(':zipcode')
  async consult(
    @Query('loggedUserId') loggedUserId: string,
    @Param('zipcode') zipcode: string
  ) {
    const result = await this.consultZipcodeService.consult({
      loggedUserId,
      zipcode,
    });

    if (result.isRight()) return result.value;
    else await ErrorMessageResult(result.value.name, result.value.message);
  }
}
