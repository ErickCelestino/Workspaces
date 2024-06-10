import { FileWithProgress } from '@workspaces/domain';
import { pureTvApi } from '../../axios-config';

export async function CreateContenVideoRequest(
  filesWithProgress: FileWithProgress[],
  config: {
    directoryId: string;
    loggedUserId: string;
  }
) {
  const formData = new FormData();
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
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`Progress for: ${progress}%`);
        }
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}
