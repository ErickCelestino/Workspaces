import { Injectable } from '@nestjs/common';
import { CreateDevice, CreateDeviceDto } from '@workspaces/domain';

@Injectable()
export class CreateDeviceService {
  constructor(private useCase: CreateDevice) {}

  async create(input: CreateDeviceDto) {
    return await this.useCase.execute(input);
  }
}
