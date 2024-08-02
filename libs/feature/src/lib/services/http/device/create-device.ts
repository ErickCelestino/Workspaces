import { CreateDeviceDto, CreateDirectoryDto } from '@workspaces/domain';
import { pureTvApi } from '../axios-config';

export async function CreateDeviceRequest(input: CreateDeviceDto) {
  const result = await pureTvApi.post(
    'create-device',
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
