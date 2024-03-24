import { generalApi } from '../api';

export async function LoginRequest(email: string, password: string) {
  try {
    const request = await generalApi.post('auth/login', { email, password });
    return request.data;
  } catch (err) {
    return null;
  }
}
