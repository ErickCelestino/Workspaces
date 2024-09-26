import { DeleteDirectoryDto } from '@workspaces/domain';
import { pureTvApi } from '../axios-config';

export async function DeleteDirectoryRequest(input: DeleteDirectoryDto) {
  const result = await pureTvApi.delete(`delete-directory/${input.id}`, {
    params: {
      loggedUserId: input.loggedUserId,
    },
  });
  return result.data;
}
