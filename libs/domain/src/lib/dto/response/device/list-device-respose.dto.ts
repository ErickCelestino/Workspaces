import { Device } from '../../../entity';

export interface ListDeviceResponseDto {
  total: number;
  filteredTotal: number;
  totalPages: number;
  directories: Device[];
}
