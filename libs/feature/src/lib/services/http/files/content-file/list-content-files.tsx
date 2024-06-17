import {
  ListContentFileDto,
  ListContentFileResponseDto,
} from '@workspaces/domain';
import { pureTvApi } from '../../axios-config';

export async function ListContentFilesRequest(input: ListContentFileDto) {
  const result = await pureTvApi.get<ListContentFileResponseDto>(
    'list-content-file',
    {
      params: {
        filter: input.userInput,
        skip: input.skip,
        take: input.take,
        loggedUserId: input.loggedUserId,
        directoryId: input.directoryId,
      },
    }
  );
  return result.data;
}
