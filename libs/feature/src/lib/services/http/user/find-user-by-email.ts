import { FindUserByEmailDto, LoggedUser } from '@workspaces/domain';
import { generalApi } from '../axios-config';

export async function FindUserByEmailRequest(input: FindUserByEmailDto) {
  const resultId = await generalApi.get<LoggedUser>('find-user-by-id', {
    params: {
      email: input.email,
    },
  });
  return resultId.data;
}
