import { generalApi } from '../axios-config';

export async function FindUserRequest(id: string) {
  const resultId = await generalApi.get(`find-user-by-id/${id}`);
  return resultId.data;
}
