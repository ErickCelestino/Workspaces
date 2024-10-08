import { Body, Controller, Param, Put, Query } from '@nestjs/common';
import { ChangeUserTypeService } from './change-user-type.service';
import { ErrorMessageResult, userTypes } from '@workspaces/domain';

@Controller('change-user-type')
export class ChangeUserTypeController {
  constructor(private readonly changeUserTypeService: ChangeUserTypeService) {}

  @Put(':userId')
  async change(
    @Query('loggedUserId') loggedUserId: string,
    @Param('userId') userId: string,
    @Body() body: { type: string }
  ) {
    const result = await this.changeUserTypeService.change({
      loggedUserId,
      type: body.type as userTypes,
      userId,
    });

    if (result.isRight()) return { userId: result.value };
    else await ErrorMessageResult(result.value.name, result.value.message);
  }
}
