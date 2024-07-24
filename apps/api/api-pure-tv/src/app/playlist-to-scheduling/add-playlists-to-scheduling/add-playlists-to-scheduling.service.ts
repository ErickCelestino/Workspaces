import { Injectable } from '@nestjs/common';
import {
  AddPlaylistsToScheduling,
  AddPlaylistsToSchedulingDto,
} from '@workspaces/domain';

@Injectable()
export class AddPlaylistsToSchedulingService {
  constructor(private useCase: AddPlaylistsToScheduling) {}

  async add(input: AddPlaylistsToSchedulingDto) {
    return await this.useCase.execute(input);
  }
}
