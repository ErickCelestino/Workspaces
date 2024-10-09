import { EditProfileDto } from '@workspaces/domain';
import { generalApi } from '../axios-config';

export async function EditProfileRequest(input: EditProfileDto) {
  const resultId = await generalApi.put(
    `edit-profile/${input.userId}`,
    {
      name: input.body.name,
      birthDate: input.body.birthDate,
      nickname: input.body.nickname,
    },
    {
      params: {
        loggedUserId: input.loggedUserId,
      },
    }
  );
  return resultId.data;
}
