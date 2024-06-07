import { FileWithProgress } from '@workspaces/domain';
import { pureTvApi } from '../../axios-config';

export async function CreateContenVideoRequest(
  filesWithProgress: FileWithProgress[],
  config: {
    directoryId: string;
    loggedUserId: string;
  }
) {
  const uploadPromises = filesWithProgress.map(async (fileWithProgress) => {
    const formData = new FormData();
    formData.append('files', fileWithProgress.file);

    try {
      const response = await pureTvApi.post('/create-content-video', formData, {
        params: {
          loggedUserId: config.loggedUserId,
          directoryId: config.directoryId,
        },
        onUploadProgress: (progressEvent_1) => {
          console.log(progressEvent_1);
          if (progressEvent_1.total) {
            const progress = Math.round(
              (progressEvent_1.loaded * 100) / progressEvent_1.total
            );
            console.log(
              `Progress for ${fileWithProgress.file.name}: ${progress}%`
            );
          }
        },
      });
      console.log('Upload successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error uploading file:', fileWithProgress.file.name, error);
      throw error;
    }
  });

  try {
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    console.error('Some uploads failed:', error);
    throw error;
  }
}
