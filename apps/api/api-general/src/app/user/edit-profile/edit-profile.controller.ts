import { Body, Controller, Param, Put, Query } from '@nestjs/common';
import { EditProfileService } from './edit-profile.service';
import { BodyUserDto, ErrorMessageResult } from '@workspaces/domain';

@Controller('edit-profile')
export class EditProfileController {
  constructor(private readonly editProfileService: EditProfileService) {}

  @Put(':userId')
  async edit(
    @Param('userId') userId: string,
    @Query('loggedUserId') loggedUserId: string,
    @Body() body: Omit<BodyUserDto, 'status' | 'type' | 'id'>
  ) {
    const result = await this.editProfileService.edit({
      body: body?.name
        ? body
        : ({} as Omit<BodyUserDto, 'status' | 'type' | 'id'>),
      loggedUserId,
      userId,
    });

    if (result.isRight()) return { userId: result.value };
    else await ErrorMessageResult(result.value.name, result.value.message);
  }
}
