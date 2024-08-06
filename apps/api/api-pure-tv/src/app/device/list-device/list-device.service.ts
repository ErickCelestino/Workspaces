import { Injectable } from '@nestjs/common';
import { ListDevice, ListDeviceDto } from '@workspaces/domain';

@Injectable()
export class ListDeviceService {
  constructor(private useCase: ListDevice) {}

  async list(input: ListDeviceDto) {
    return await this.useCase.execute(input);
  }
}