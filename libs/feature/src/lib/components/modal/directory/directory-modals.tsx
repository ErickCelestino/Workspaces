import { FC } from 'react';
import { CrudType } from '@workspaces/domain';
import { CreateDirectoryModal, DeleteDirectoryModal } from '.';
import { AddSchedulesToDeviceModal } from '../schedules-to-device';

interface DeviceModalsProps {
  selectedId: string;
  openModal: {
    create: boolean;
    delete: boolean;
    edit: boolean;
    details: boolean;
  };
  handlePopUpClose: (type: CrudType) => void;
  showAlert: (message: string, success: boolean) => void;
  createDirectoryTitle?: string;
  deleteDirectoryTitle?: string;
}

export const DirectoryModals: FC<DeviceModalsProps> = ({
  selectedId,
  openModal,
  handlePopUpClose,
  showAlert,
  createDirectoryTitle = 'Cadastrar Diretório',
  deleteDirectoryTitle = 'Deletar Diretório',
}) => {
  return (
    <>
      <CreateDirectoryModal
        open={openModal.create}
        title={createDirectoryTitle}
        handlePopUpClose={() => handlePopUpClose('create')}
        showAlert={showAlert}
      />
      <DeleteDirectoryModal
        open={openModal.delete}
        title={deleteDirectoryTitle}
        handlePopUpClose={() => handlePopUpClose('delete')}
        showAlert={showAlert}
        idToDelete={selectedId}
      />
    </>
  );
};
