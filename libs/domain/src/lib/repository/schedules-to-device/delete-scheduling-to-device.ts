import { DeleteSchedulesToDeviceDto } from '../../dto';

export interface DeleteSchedulingToDeviceRepository {
  delete(input: DeleteSchedulesToDeviceDto): Promise<string>;
}
