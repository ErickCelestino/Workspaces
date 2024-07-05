import { Injectable } from '@nestjs/common';
import { EditPlaylist, EditPlaylistDto } from '@workspaces/domain';

@Injectable()
export class EditPlaylistService {
  constructor(private useCase: EditPlaylist) {}

  async edit(input: EditPlaylistDto) {
    return await this.useCase.execute(input);
  }
}
