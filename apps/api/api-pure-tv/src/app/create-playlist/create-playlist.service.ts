import { Injectable } from '@nestjs/common';
import { CreatePlaylist, CreatePlaylistDto } from '@workspaces/domain';

@Injectable()
export class CreatePlaylistService {
  constructor(private useCase: CreatePlaylist) {}

  async create(input: CreatePlaylistDto) {
    return this.useCase.execute(input);
  }
}
