import { CreateDeviceBodyDto } from './create-device-body.dto';

export interface CreateDeviceDto {
  body: CreateDeviceBodyDto;
  loggedUserId: string;
}
