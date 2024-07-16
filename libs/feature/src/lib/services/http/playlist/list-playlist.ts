import { ListPlaylistDto, ListPlaylistResponseDto } from '@workspaces/domain';
import { pureTvApi } from '../axios-config';

export async function ListPlaylistRequest(input: ListPlaylistDto) {
  const skip = input?.skip || 0;
  const take = input?.take || 6;
  const result = await pureTvApi.get<ListPlaylistResponseDto>('list-playlist', {
    params: {
      filter: input.userInput,
      skip: skip,
      take: take,
      loggedUserId: input.loggedUserId,
    },
  });
  return result.data;
}
