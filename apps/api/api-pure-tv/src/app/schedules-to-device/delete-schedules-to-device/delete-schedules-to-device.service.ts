import { Injectable } from '@nestjs/common';
import {
  DeleteSchedulesToDevice,
  DeleteSchedulesToDeviceDto,
} from '@workspaces/domain';

@Injectable()
export class DeleteSchedulesToDeviceService {
  constructor(private useCase: DeleteSchedulesToDevice) {}

  async delete(input: DeleteSchedulesToDeviceDto) {
    return await this.useCase.execute(input);
  }
}
