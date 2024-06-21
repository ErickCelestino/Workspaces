import { EditContentFileDto } from '@workspaces/domain';
import { pureTvApi } from '../../axios-config';

export async function EditContentFileRequest(input: EditContentFileDto) {
  const result = await pureTvApi.put(`edit-content-file/${input.idToEdit}`, {
    params: {
      loggedUserId: input.loggedUserId,
      directoryId: input.directoryId,
    },
    data: {
      newFileName: input.newFileName,
    },
  });
  return result.data;
}
