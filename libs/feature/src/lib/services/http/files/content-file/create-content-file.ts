import { FileConfigs, FileWithProgress } from '@workspaces/domain';
import { pureTvApi } from '../../axios-config';

export async function CreateContenVideoRequest(
  data: FileConfigs,
  onUploadProgress: (progress: number) => void
) {
  const formData = new FormData();

  let totalSize = 0;
  data.filesToUpload.forEach((file) => {
    formData.append('files', file.file);
    totalSize += file.file.size;
  });

  let totalLoaded = 0;

  const response = await pureTvApi.post('/create-content-video', formData, {
    params: {
      loggedUserId: data.loggedUserId,
      directoryId: data.directoryId,
    },
    onUploadProgress: (progressEvent) => {
      if (progressEvent) {
        totalLoaded = progressEvent.loaded;
        const progress = Math.round((totalLoaded * 100) / totalSize);
        onUploadProgress(progress);
      }
    },
  });
  return response.data;
}
