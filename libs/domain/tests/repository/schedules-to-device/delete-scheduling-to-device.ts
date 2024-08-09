import {
  DeleteSchedulesToDeviceDto,
  DeleteSchedulingRepository,
  DeleteSchedulingToDeviceRepository,
} from '../../../src';
import { SchedulesToDeviceMock } from '../../entity/schedules-to-device/schedules-to-device.mock';

export class DeleteSchedulingToDeviceRepositoryMock
  implements DeleteSchedulingToDeviceRepository
{
  inputMock = {} as DeleteSchedulesToDeviceDto;
  async delete(input: DeleteSchedulesToDeviceDto): Promise<string> {
    this.inputMock = input;
    return SchedulesToDeviceMock.id;
  }
}
