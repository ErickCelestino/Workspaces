import { FileWithProgress } from '@workspaces/domain';
import { pureTvApi } from '../../axios-config';

export async function CreateContenVideoRequest(
  filesWithProgress: FileWithProgress[],
  config: {
    directoryId: string;
    loggedUserId: string;
  }
) {
  filesWithProgress.forEach((fileWithProgress) => {
    const formData = new FormData();
    filesWithProgress.forEach((fileWithProgress) => {
      formData.append('files', fileWithProgress.file);
    });
    console.log(config);
    formData.append('loggedUserId', config.loggedUserId);
    formData.append('directoryId', config.directoryId);

    pureTvApi.post('/create-content-video', formData, {
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          // You can implement a callback here to update the progress in the component
          console.log(
            `Progress for ${fileWithProgress.file.name}: ${progress}%`
          );
        }
      },
    });
  });
}
