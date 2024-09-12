import { DeleteDirectoryDto } from '@workspaces/domain';
import { pureTvApi } from '../axios-config';
import { ListContentFilesRequest } from '../file';

export async function DeleteDirectoryRequest(input: DeleteDirectoryDto) {
  const filesInDirectory = await ListContentFilesRequest({
    userInput: '',
    loggedUserId: input.loggedUserId,
    directoryId: input.id,
  });

  if (filesInDirectory.files.length > 0) {
    throw new Error('Diretório não está vazio');
  }

  const result = await pureTvApi.delete(`delete-directory/${input.id}`, {
    params: {
      loggedUserId: input.loggedUserId,
    },
  });
  return result.data;
}
