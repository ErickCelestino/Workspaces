export interface EditSchedulingBodyDto {
  id: string;
  name: string;
  startTime: string | Date;
  endTime: string | Date;
  lopping: boolean;
  priority: string;
}
