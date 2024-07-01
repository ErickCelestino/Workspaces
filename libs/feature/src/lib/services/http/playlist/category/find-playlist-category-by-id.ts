import {
  FindPlaylistCategoryByIdDto,
  PlaylistCategory,
} from '@workspaces/domain';
import { pureTvApi } from '../../axios-config';

export async function FindPlaylistCategoryByIdRequest(
  input: FindPlaylistCategoryByIdDto
) {
  const result = await pureTvApi.get<PlaylistCategory>(
    `find-playlist-category-by-id/${input.id}`,

    {
      params: {
        loggedUserId: input.loggedUserId,
      },
    }
  );
  return result.data;
}
