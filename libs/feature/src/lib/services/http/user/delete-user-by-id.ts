import { DeleteUserByIdDto } from '@workspaces/domain';
import { generalApi } from '../axios-config';

export async function DeleteUserByIdRequest(input: DeleteUserByIdDto) {
  const resultId = await generalApi.delete(`delete-user-by-id/${input.id}`, {
    params: {
      logged_user: input.loggedUser,
    },
    data: {
      description: input.description,
    },
  });
  return resultId.data;
}
