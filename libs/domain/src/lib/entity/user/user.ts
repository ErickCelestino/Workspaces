import { Auth } from './auth';

export interface User {
  user_id: string;
  name: string;
  nickname: string;
  birthDate: Date | null;
  auth: Auth[];
}
