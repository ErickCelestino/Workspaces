import { CreateSchedulingDto, EditSchedulingDto } from '@workspaces/domain';
import { pureTvApi } from '../axios-config';

export async function EditSchedulingRequest(input: EditSchedulingDto) {
  console.log(input);
  const result = await pureTvApi.put(
    `edit-scheduling/${input.id}`,
    {
      name: input.body.name,
      startTime: input.body.startTime,
      endTime: input.body.endTime,
      lopping: input.body.lopping,
      priority: input.body.priority,
    },
    {
      params: {
        loggedUserId: input.loggedUserId,
      },
    }
  );
  return result.data;
}
