import { Injectable } from '@nestjs/common';
import { EditProfile, EditProfileDto } from '@workspaces/domain';

@Injectable()
export class EditProfileService {
  constructor(private useCase: EditProfile) {}

  async edit(input: EditProfileDto) {
    return await this.useCase.execute(input);
  }
}
