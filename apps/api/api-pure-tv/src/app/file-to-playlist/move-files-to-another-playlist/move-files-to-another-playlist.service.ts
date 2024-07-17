import { Injectable } from '@nestjs/common';
import {
  MoveFilesToAnotherPlaylist,
  MoveFilesToAnotherPlaylistDto,
} from '@workspaces/domain';

@Injectable()
export class MoveFilesToAnotherPlaylistService {
  constructor(private useCase: MoveFilesToAnotherPlaylist) {}

  async move(input: MoveFilesToAnotherPlaylistDto) {
    return this.useCase.execute(input);
  }
}
