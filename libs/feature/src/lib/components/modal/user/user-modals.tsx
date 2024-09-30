import { FC } from 'react';
import { CrudType } from '@workspaces/domain';
import {
  AddUserToAnotherCompanyModal,
  DeleteUserModal,
  EditUserModal,
} from '.';

interface UserModalsProps {
  selectedId: string;
  openModal: {
    delete: boolean;
    edit: boolean;
    'add-company': boolean;
  };
  handlePopUpClose: (type: CrudType | 'add-company') => void;
  showAlert: (message: string, success: boolean) => void;
  deleteUserTitle?: string;
  deleteUserSubTitle?: string;
  editUserTitle?: string;
  addUserToAnotherCompanyTitle?: string;
}

export const UserModals: FC<UserModalsProps> = ({
  selectedId,
  openModal,
  handlePopUpClose,
  showAlert,
  deleteUserTitle = 'Deletar Usuário?',
  deleteUserSubTitle = 'Por favor, selecione alguma das alternativas',
  editUserTitle = 'Editar Usuário',
  addUserToAnotherCompanyTitle = 'Adionar Empresa',
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

      <AddUserToAnotherCompanyModal
        userId={selectedId}
        handlePopUpClose={() => handlePopUpClose('add-company')}
        showAlert={showAlert}
        open={openModal['add-company']}
        title={addUserToAnotherCompanyTitle}
      />
    </>
  );
};
