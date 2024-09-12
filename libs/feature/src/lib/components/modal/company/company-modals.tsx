import { FC } from 'react';
import { CrudType } from '@workspaces/domain';
import { CreateCompanyModal, DeleteCompanyModal, EditCompanyModal } from '.';

interface CompanyModalsProps {
  selectedId: string;
  openModal: { create: boolean; delete: boolean; edit: boolean };
  handlePopUpClose: (type: CrudType) => void;
  showAlert: (message: string, success: boolean) => void;
}

export const CompanyModals: FC<CompanyModalsProps> = ({
  selectedId,
  openModal,
  handlePopUpClose,
  showAlert,
}) => {
  return (
    <>
      <CreateCompanyModal
        open={openModal.create}
        title="Cadastrar Empresa"
        handlePopUpClose={() => handlePopUpClose('create')}
        showAlert={showAlert}
      />
      <DeleteCompanyModal
        open={openModal.delete}
        title="Deletar Empresa"
        handlePopUpClose={() => handlePopUpClose('delete')}
        showAlert={showAlert}
        idToDelete={selectedId}
      />
      <EditCompanyModal
        open={openModal.edit}
        title="Editar Empresa"
        handlePopUpClose={() => handlePopUpClose('edit')}
        showAlert={showAlert}
        companyId={selectedId}
      />
    </>
  );
};
