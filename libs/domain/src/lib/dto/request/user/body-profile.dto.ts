import { BodyUserDto } from './body-user.dto';

export interface BodyProfileBodyDto
  extends Omit<BodyUserDto, 'status' | 'type' | 'id'> {
  nickname: string;
}
