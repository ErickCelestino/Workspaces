export interface CreateSchedulingDto {
  loggedUserId: string;
  name: string;
  start_time: string;
  start_end: string;
  lopping: boolean;
  priority: number;
}
