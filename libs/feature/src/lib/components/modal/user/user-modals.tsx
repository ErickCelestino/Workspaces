import { FC } from 'react';
import { CrudType } from '@workspaces/domain';
import { DeleteUserModal, EditUserModal } from '.';

interface UserModalsProps {
  selectedId: string;
  openModal: {
    delete: boolean;
    edit: boolean;
  };
  handlePopUpClose: (type: CrudType | 'add') => void;
  showAlert: (message: string, success: boolean) => void;
  deleteUserTitle?: string;
  deleteUserSubTitle?: string;
  editUserTitle?: string;
}

export const UserModals: FC<UserModalsProps> = ({
  selectedId,
  openModal,
  handlePopUpClose,
  showAlert,
  deleteUserTitle = 'Deletar Usuário?',
  deleteUserSubTitle = 'Por favor, selecione alguma das alternativas',
  editUserTitle = 'Editar Usuário',
}) => {
  return (
    <>
      <EditUserModal
        idToEdit={selectedId}
        handlePopUpClose={() => handlePopUpClose('edit')}
        showAlert={showAlert}
        open={openModal.edit}
        title={editUserTitle}
      />
      <DeleteUserModal
        idToDelete={selectedId}
        handlePopUpClose={() => handlePopUpClose('delete')}
        showAlert={showAlert}
        open={openModal.delete}
        title={deleteUserTitle}
        subTitle={deleteUserSubTitle}
      />
    </>
  );
};
