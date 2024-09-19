import { FC } from 'react';
import { CrudType } from '@workspaces/domain';
import {
  CreateCompanyModal,
  DeleteCompanyModal,
  DetailsCompanyModal,
  EditCompanyModal,
  ListUsersByCompanyIdModal,
} from '.';

interface CompanyModalsProps {
  selectedId: string;
  openModal: {
    create: boolean;
    delete: boolean;
    edit: boolean;
    details: boolean;
    'list-users': boolean;
  };
  handlePopUpClose: (type: CrudType | 'list-users') => void;
  showAlert: (message: string, success: boolean) => void;
  createCompanyTitle?: string;
  deleteCompanyTitle?: string;
  editCompanyTitle?: string;
  detailsCompanyTitle?: string;
  listUsersByCompanyIdTitle?: string;
}

export const CompanyModals: FC<CompanyModalsProps> = ({
  selectedId,
  openModal,
  handlePopUpClose,
  showAlert,
  createCompanyTitle = 'Cadastrar Empresa',
  deleteCompanyTitle = 'Deletar Empresa',
  editCompanyTitle = 'Editar Empresa',
  detailsCompanyTitle = 'Detalhes da Empresa',
  listUsersByCompanyIdTitle = 'Listagem de Usuários',
}) => {
  return (
    <>
      <CreateCompanyModal
        open={openModal.create}
        title={createCompanyTitle}
        handlePopUpClose={() => handlePopUpClose('create')}
        showAlert={showAlert}
      />
      <DeleteCompanyModal
        open={openModal.delete}
        title={deleteCompanyTitle}
        handlePopUpClose={() => handlePopUpClose('delete')}
        showAlert={showAlert}
        idToDelete={selectedId}
      />
      <EditCompanyModal
        open={openModal.edit}
        title={editCompanyTitle}
        handlePopUpClose={() => handlePopUpClose('edit')}
        showAlert={showAlert}
        companyId={selectedId}
      />
      <DetailsCompanyModal
        open={openModal.details}
        title={detailsCompanyTitle}
        handlePopUpClose={() => handlePopUpClose('details')}
        showAlert={showAlert}
        companyId={selectedId}
      />
      <ListUsersByCompanyIdModal
        open={openModal['list-users']}
        title={listUsersByCompanyIdTitle}
        handlePopUpClose={() => handlePopUpClose('list-users')}
        showAlert={showAlert}
        companyId={selectedId}
      />
    </>
  );
};
