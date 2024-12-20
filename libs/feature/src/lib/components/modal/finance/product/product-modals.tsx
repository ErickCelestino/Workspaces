import { CrudType, ProductBodyDto } from '@workspaces/domain';
import { FC } from 'react';
import { CreateProductModal } from './create-product-modal';
import { DeleteProductModal } from './delete-product-modal';
import { EditProductModal } from './edit-product-modal';

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
  editProductTitle?: string;
  product?: ProductBodyDto;
}

export const ProductModals: FC<ProductmodalsProps> = ({
  selectedId,
  openModal,
  handlePopUpClose,
  showAlert,
  product,
  createProductTitle = 'Cadastrar Produto',
  editProductTitle = 'Editar Produto',
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

      <EditProductModal
        open={openModal.edit}
        product={product ?? ({} as ProductBodyDto)}
        idToEdit={selectedId}
        title={editProductTitle}
        handlePopUpClose={() => handlePopUpClose('edit')}
        showAlert={showAlert}
      />
    </>
  );
};
