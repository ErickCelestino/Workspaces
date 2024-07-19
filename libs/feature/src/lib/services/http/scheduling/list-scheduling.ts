import {
  ListSchedulingDto,
  ListSchedulingReponseDto,
} from '@workspaces/domain';
import { pureTvApi } from '../axios-config';

export async function ListSchedulingRequest(input: ListSchedulingDto) {
  const skip = input?.skip || 0;
  const take = input?.take || 6;
  const result = await pureTvApi.get<ListSchedulingReponseDto>(
    'list-scheduling',
    {
      params: {
        filter: input.filter,
        skip: skip,
        take: take,
        loggedUserId: input.loggedUserId,
      },
    }
  );
  return result.data;
}
