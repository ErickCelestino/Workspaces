import { FC } from 'react';
import { SimpleConfimationModal } from '../simple';
import axios, { AxiosError } from 'axios';
import { ErrorResponse } from '@workspaces/domain';
import { ValidationsError } from '../../../shared';
import { DeletePlaylistToSchedulingRequest } from '../../../services';
import { useLoggedUser } from '../../../contexts';

interface DeletePlaylistToSchedulingModalProps {
  open: boolean;
  title: string;
  subtTitle: string;
  idScheduling: string;
  idPlaylist: string;
  handlePopUpClose: () => void;
  showAlert: (message: string, success: boolean) => void;
  successMessage?: string;
}

export const DeletePlaylistToSchedulingModal: FC<
  DeletePlaylistToSchedulingModalProps
> = ({
  handlePopUpClose,
  showAlert,
  title,
  subtTitle,
  open,
  idScheduling,
  idPlaylist,
  successMessage = 'Playlists Removida com Sucesso',
}) => {
  const { loggedUser } = useLoggedUser();
  const deletePlaylistToScheduling = async () => {
    try {
      await DeletePlaylistToSchedulingRequest({
        loggedUserId: loggedUser?.id ?? '',
        playlistId: idPlaylist,
        schedulingId: idScheduling,
      });
      showAlert(successMessage, true);
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        const errors = ValidationsError(axiosError, 'Playlist');
        if (errors) {
          showAlert(errors, false);
        }
      }
    }
  };

  return (
    <SimpleConfimationModal
      open={open}
      title={title}
      onClose={handlePopUpClose}
      onSuccess={deletePlaylistToScheduling}
      subTitle={subtTitle}
    />
  );
};
