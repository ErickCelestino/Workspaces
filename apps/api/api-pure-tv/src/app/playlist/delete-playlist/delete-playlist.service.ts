import { Injectable } from '@nestjs/common';
import { DeletePlaylist, DeletePlaylistDto } from '@workspaces/domain';

@Injectable()
export class DeletePlaylistService {
  constructor(private useCase: DeletePlaylist) {}

  async delete(input: DeletePlaylistDto) {
    return await this.useCase.execute(input);
  }
}