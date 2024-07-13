import { CreateDirectoryDto } from '@workspaces/domain';
import { pureTvApi } from '../axios-config';

export async function CreateDirectoryRequest(input: CreateDirectoryDto) {
  const result = await pureTvApi.post('create-directory', {
    name: input.body.name,
    loggedUserId: input.loggedUserId,
  });

  return result.data;
}
