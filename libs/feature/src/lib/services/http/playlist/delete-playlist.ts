import { DeletePlaylistCategoryDto } from '@workspaces/domain';
import { pureTvApi } from '../axios-config';

export async function DeletePlaylistRequest(input: DeletePlaylistCategoryDto) {
  const result = await pureTvApi.delete(`delete-playlist/${input.id}`, {
    params: {
      loggedUserId: input.loggedUserId,
    },
  });
  return result.data;
}
