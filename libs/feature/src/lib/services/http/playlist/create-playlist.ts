import { CreatePlaylistDto } from '@workspaces/domain';
import { pureTvApi } from '../axios-config';

export async function CreatePlaylistRequest(input: CreatePlaylistDto) {
  const result = await pureTvApi.post(
    'create-playlist',
    {
      name: input.name,
    },
    {
      params: {
        loggedUserId: input.loggedUserId,
        playlistCategoryId: input.playlistCategoryId,
      },
    }
  );
  return result.data;
}
