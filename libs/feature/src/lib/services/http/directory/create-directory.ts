import { CreateDirectoryDto } from '@workspaces/domain';
import { pureTvApi } from '../axios-config';

export async function CreateDirectoryRequest(input: CreateDirectoryDto) {
  const result = await pureTvApi.post<{ directory_id: string }>(
    'create-directory',
    {
      name: input.body.name,
    },
    {
      params: {
        loggedUserId: input.loggedUserId,
      },
    }
  );

  return result.data;
}
