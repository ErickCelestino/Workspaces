import {
  DownloadContentFileDto,
  DownloadContentFileResponseDto,
} from '@workspaces/domain';
import { pureTvApi } from '../../axios-config';

export async function DownloadContentFileRequest(
  input: DownloadContentFileDto
) {
  const { idToDownload, loggedUserId, directoryId } = input;

  const result = await pureTvApi.get<DownloadContentFileResponseDto>(
    `download-content-file/${idToDownload}`,
    {
      params: {
        loggedUserId,
        directoryId,
      },
    }
  );

  console.log('directoryId');
  console.log(directoryId);
  console.log(result);
  return result.data;
}
