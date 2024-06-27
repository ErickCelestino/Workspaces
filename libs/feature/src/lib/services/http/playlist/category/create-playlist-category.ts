import { CreatePlaylistCategoryDto } from '@workspaces/domain';
import { pureTvApi } from '../../axios-config';

export async function CreatePlaylistCategoryRequest(
  input: CreatePlaylistCategoryDto
) {
  const result = await pureTvApi.post(
    'create-playlist-category',
    {
      name: input.body.name,
      description: input.body.description,
    },
    {
      params: {
        loggedUserId: input.loggedUserId,
      },
    }
  );
  return result.data;
}
