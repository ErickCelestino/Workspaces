import { Injectable } from '@nestjs/common';
import { CreateContentVideo, CreateContentVideoDto } from '@workspaces/domain';

@Injectable()
export class CreateContentVideoService {
  constructor(private useCase: CreateContentVideo) {}

  async create(input: CreateContentVideoDto) {
    return await this.useCase.execute(input);
  }
}
