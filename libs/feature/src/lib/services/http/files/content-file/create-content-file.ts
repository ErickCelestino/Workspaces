import { FileWithProgress } from '@workspaces/domain';
import { pureTvApi } from '../../axios-config';

export async function CreateContenVideoRequest(
  filesWithProgress: FileWithProgress[],
  config: {
    directoryId: string;
    loggedUserId: string;
  },
  onUploadProgress: (progress: number) => void
) {
  const formData = new FormData();

  let totalSize = 0;
  filesWithProgress.forEach((file) => {
    formData.append('files', file.file);
    totalSize += file.file.size;
  });

  let totalLoaded = 0;

  const response = await pureTvApi.post('/create-content-video', formData, {
    params: {
      loggedUserId: config.loggedUserId,
      directoryId: config.directoryId,
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
