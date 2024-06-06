import { FileWithProgress } from '@workspaces/domain';
import { pureTvApi } from '../../axios-config';

export async function CreateContenVideoRequest(
  filesWithProgress: FileWithProgress[],
  config: {
    directoryId: string;
    loggedUserId: string;
  }
) {
  const uploadPromises = filesWithProgress.map((fileWithProgress) => {
    const formData = new FormData();
    formData.append('files', fileWithProgress.file);

    return pureTvApi
      .post('/create-content-video', formData, {
        params: {
          loggedUserId: config.loggedUserId,
          directoryId: config.directoryId,
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            console.log(
              `Progress for ${fileWithProgress.file.name}: ${progress}%`
            );
          }
        },
      })
      .then((response) => {
        console.log('Upload successful:', response.data);
        return response.data;
      })
      .catch((error) => {
        console.error(
          'Error uploading file:',
          fileWithProgress.file.name,
          error
        );
        throw error;
      });
  });

  try {
    const results = await Promise.all(uploadPromises);
    console.log('All uploads successful:', results);
    return results;
  } catch (error) {
    console.error('Some uploads failed:', error);
    throw error;
  }
}
