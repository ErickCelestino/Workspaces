import { DownloadContentFileDto } from '@workspaces/domain';
import { pureTvApi } from '../../axios-config';

export async function DownloadContentFileRequest(
  input: DownloadContentFileDto
) {
  const { idToDownload, loggedUserId, directoryId } = input;

  const result = await pureTvApi.get(`download-content-file/${idToDownload}`, {
    params: {
      loggedUserId,
      directoryId,
    },
  });
  return result.data;
}
