export interface CreateSchedulingDto {
  loggedUserId: string;
  name: string;
  startTime: string;
  endTime: string;
  lopping: boolean;
  priority: number;
}
