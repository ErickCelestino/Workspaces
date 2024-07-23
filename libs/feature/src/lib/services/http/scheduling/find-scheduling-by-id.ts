import { FindSchedulingByIdDto } from '@workspaces/domain';
import { pureTvApi } from '../axios-config';

export async function FindSchedulingByIdRequest(input: FindSchedulingByIdDto) {
  console.log(input);
  const result = await pureTvApi.get(`find-scheduling-by-id/${input.id}`, {
    params: {
      loggedUserId: input.loggedUserId,
    },
  });
  return result.data;
}
