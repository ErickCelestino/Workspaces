import { BodyUserDto } from './body-user.dto';

export interface EditProfileDto {
  loggedUserId: string;
  userId: string;
  body: Omit<BodyUserDto, 'status' | 'type' | 'id'> & {
    nickname: string;
  };
}
