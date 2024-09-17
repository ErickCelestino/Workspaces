import { FC } from 'react';
import { CrudType } from '@workspaces/domain';
import {
  CreatePlaylistCategoryModal,
  DeletePlaylistCategoryModal,
  EditPlaylistCategoryModal,
} from '.';

interface playlistCategoryModalsProps {
  selectedId: string;
  companyId: string;
  openModal: {
    create: boolean;
    delete: boolean;
    edit: boolean;
  };
  handlePopUpClose: (type: CrudType) => void;
  showAlert: (message: string, success: boolean) => void;
  createPlaylistCategoryTitle?: string;
  deletePlaylistCategoryTitle?: string;
  deletePlaylistCategorySubTitle?: string;
  editPlaylistCategoryTitle?: string;
}

export const PlaylistCategoryModals: FC<playlistCategoryModalsProps> = ({
  selectedId,
  companyId,
  openModal,
  handlePopUpClose,
  showAlert,
  createPlaylistCategoryTitle = 'Criar Playlist',
  deletePlaylistCategoryTitle = 'Deletar Playlist?',
  deletePlaylistCategorySubTitle = 'Por favor, selecione alguma das alternativas',
  editPlaylistCategoryTitle = 'Editar Playlist',
}) => {
  return (
    <>
      <CreatePlaylistCategoryModal
        handlePopUpClose={() => handlePopUpClose('create')}
        showAlert={showAlert}
        open={openModal.create}
        title={createPlaylistCategoryTitle}
      />
      <EditPlaylistCategoryModal
        selectedId={selectedId}
        handlePopUpClose={() => handlePopUpClose('edit')}
        showAlert={showAlert}
        open={openModal.edit}
        title={editPlaylistCategoryTitle}
      />
      <DeletePlaylistCategoryModal
        selectedId={selectedId}
        handlePopUpClose={() => handlePopUpClose('delete')}
        showAlert={showAlert}
        open={openModal.delete}
        title={deletePlaylistCategoryTitle}
        subTitle={deletePlaylistCategorySubTitle}
      />
    </>
  );
};