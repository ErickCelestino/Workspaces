export interface ListDeviceDto {
  filter: string;
  loggedUserId: string;
  take?: number;
  skip?: number;
}
