import { CrudType } from '@workspaces/domain';
import { FC } from 'react';
import { CreateProductModal } from './create-product-modal';

interface ProductmodalsProps {
  selectedId: string;
  openModal: {
    create: boolean;
    delete: boolean;
    edit: boolean;
    details: boolean;
  };
  handlePopUpClose: (type: CrudType) => void;
  showAlert: (message: string, success: boolean) => void;
  createProductTitle?: string;
}

export const ProductModals: FC<ProductmodalsProps> = ({
  selectedId,
  openModal,
  handlePopUpClose,
  showAlert,
  createProductTitle = 'Cadastrar Produto',
}) => {
  return (
    <>
      <CreateProductModal
        open={openModal.create}
        title={createProductTitle}
        handlePopUpClose={() => handlePopUpClose('create')}
        showAlert={showAlert}
      />
    </>
  );
};
