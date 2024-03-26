import { generalApi } from '../api';

export async function LoginRequest(email: string, password: string) {
  const request = await generalApi.post('auth/login', { email, password });
  return request.data;
}
