import { MoveFileToDirectoryDto } from '@workspaces/domain';
import { pureTvApi } from '../../axios-config';

export async function MoveFileToDirectoryRequest(
  input: MoveFileToDirectoryDto
) {
  const { idToMove, loggedUserId, idToMoveDirectory } = input;
  console.log('idToMove', idToMove);
  console.log('loggedUserId', loggedUserId);
  console.log('idToMoveDirectory', idToMoveDirectory);
  const result = await pureTvApi.post(
    `move-file-to-directory/${idToMove}`,
    null,
    {
      params: {
        idToMoveDirectory: idToMoveDirectory,
        loggedUserId: loggedUserId,
      },
    }
  );
  return result.data;
}
