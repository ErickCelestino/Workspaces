import { DeleteSchedulingDto } from '@workspaces/domain';
import { pureTvApi } from '../axios-config';

export async function DeleteSchedulingRequest(input: DeleteSchedulingDto) {
  console.log(input);
  const result = await pureTvApi.delete(`delete-scheduling/${input.id}`, {
    params: {
      loggedUserId: input.loggedUserId,
    },
  });
  return result.data;
}