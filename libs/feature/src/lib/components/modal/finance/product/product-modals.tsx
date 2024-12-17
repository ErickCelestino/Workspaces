import { CrudType } from '@workspaces/domain';
import { FC } from 'react';
import { CreateProductModal } from './create-product-modal';
import { DeleteProductModal } from './delete-product-modal';

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
  deleteProductTitle?: string;
  deleteProductSubTitle?: string;
}

export const ProductModals: FC<ProductmodalsProps> = ({
  selectedId,
  openModal,
  handlePopUpClose,
  showAlert,
  createProductTitle = 'Cadastrar Produto',
  deleteProductTitle = 'Deletar Produto',
  deleteProductSubTitle = 'Tem certeza que desejar deletar este produto ?',
}) => {
  return (
    <>
      <CreateProductModal
        open={openModal.create}
        title={createProductTitle}
        handlePopUpClose={() => handlePopUpClose('create')}
        showAlert={showAlert}
      />

      <DeleteProductModal
        open={openModal.delete}
        idToDelete={selectedId}
        title={deleteProductTitle}
        subTitle={deleteProductSubTitle}
        handlePopUpClose={() => handlePopUpClose('delete')}
        showAlert={showAlert}
      />
    </>
  );
};
