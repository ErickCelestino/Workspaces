import { FileWithProgress } from '@workspaces/domain';
import { pureTvApi } from '../../axios-config';

export async function CreateContenVideoRequest(
  filesWithProgress: FileWithProgress[],
  config: {
    directoryId: string;
    loggedUserId: string;
  },
  onUploadProgress: (fileIndex: number, progress: number) => void
) {
  const formData = new FormData();
  const totalSize = filesWithProgress.reduce(
    (sum, fileWithProgress) => sum + fileWithProgress.file.size,
    0
  );
  const progressArray = filesWithProgress.map(() => 0);

  filesWithProgress.forEach((files) => {
    formData.append('files', files.file);
  });

  try {
    const response = await pureTvApi.post('/create-content-video', formData, {
      params: {
        loggedUserId: config.loggedUserId,
        directoryId: config.directoryId,
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const loaded = progressEvent.loaded;
          let totalLoaded = 0;

          filesWithProgress.forEach((fileWithProgress, index) => {
            const fileSize = fileWithProgress.file.size;
            const fileProgress = Math.min(
              100,
              Math.round((loaded * fileSize) / totalSize)
            );
            progressArray[index] = fileProgress;
            onUploadProgress(index, fileProgress);

            totalLoaded += fileProgress;
          });
        }
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}
