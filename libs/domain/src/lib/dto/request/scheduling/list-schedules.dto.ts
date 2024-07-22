export interface ListSchedulesDto {
  filter: string;
  loggedUserId: string;
  take?: number;
  skip?: number;
}
