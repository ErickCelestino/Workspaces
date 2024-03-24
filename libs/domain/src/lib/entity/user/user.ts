import { Auth } from '../auth';

export interface User {
  userId: string;
  name: string;
  nickname: string;
  birthDate: Date | null;
  auth: Auth[];
}
