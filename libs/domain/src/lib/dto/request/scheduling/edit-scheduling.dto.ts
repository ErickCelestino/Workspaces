import { EditSchedulingBodyDto } from './edit-scheduling-body.dto';

export interface EditSchedulingDto {
  loggedUserId: string;
  body: EditSchedulingBodyDto;
}
