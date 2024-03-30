import { generalApi } from '../axios-config';

export async function LoginRequest(email: string, password: string) {
  const request = await generalApi.post('auth/login', { email, password });
  return request.data;
}
