import { BodyProfileBodyDto } from './body-profile.dto';

export interface EditProfileDto {
  loggedUserId: string;
  userId: string;
  body: BodyProfileBodyDto;
}
