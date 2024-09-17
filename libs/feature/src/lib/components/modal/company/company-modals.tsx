import { FC } from 'react';
import { CrudType } from '@workspaces/domain';
import {
  CreateCompanyModal,
  DeleteCompanyModal,
  DetailsCompanyModal,
  EditCompanyModal,
} from '.';

interface CompanyModalsProps {
  selectedId: string;
  openModal: {
    create: boolean;
    delete: boolean;
    edit: boolean;
    details: boolean;
  };
  handlePopUpClose: (type: CrudType | 'details') => void;
  showAlert: (message: string, success: boolean) => void;
  createCompanyTitle?: string;
  deleteCompanyTitle?: string;
  editCompanyTitle?: string;
  detailsCompanyTitle?: string;
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
    </>
  );
};
