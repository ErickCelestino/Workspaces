import { Injectable } from '@nestjs/common';
import { DetailsPlaylist, DetailsPlaylistDto } from '@workspaces/domain';

@Injectable()
export class DetailsPlaylistService {
  constructor(private useCase: DetailsPlaylist) {}

  async details(input: DetailsPlaylistDto) {
    return await this.useCase.execute(input);
  }
}
