import {
  ListPlaylistCategoryDto,
  ListPlaylistCategoryReponseDto,
} from '@workspaces/domain';
import { pureTvApi } from '../../axios-config';

export async function ListPlaylistCategoryRequest(
  input: ListPlaylistCategoryDto
) {
  const skip = input?.skip || 0;
  const take = input?.take || 8;
  const result = await pureTvApi.get<ListPlaylistCategoryReponseDto>(
    'list-playlist-category',
    {
      params: {
        filter: input.userInput,
        skip: skip,
        take: take,
        loggedUserId: input.loggedUserId,
      },
    }
  );
  return result.data;
}
