import { FC } from 'react';
import { CrudType } from '@workspaces/domain';
import {
  EditDeviceModal,
  DeleteDeviceModal,
  DetailsDeviceModal,
  CreateDeviceModal,
} from '.';
import { AddSchedulesToDeviceModal } from '../schedules-to-device';

interface DeviceModalsProps {
  selectedId: string;
  openModal: {
    create: boolean;
    delete: boolean;
    edit: boolean;
    details: boolean;
    add: boolean;
  };
  handlePopUpClose: (type: CrudType | 'add') => void;
  showAlert: (message: string, success: boolean) => void;
}

export const DeviceModals: FC<DeviceModalsProps> = ({
  selectedId,
  openModal,
  handlePopUpClose,
  showAlert,
}) => {
  return (
    <>
      <CreateDeviceModal
        open={openModal.create}
        title="Cadastrar Dispositivo"
        handlePopUpClose={() => handlePopUpClose('create')}
        showAlert={showAlert}
      />
      <DeleteDeviceModal
        open={openModal.delete}
        title="Deletar Empresa"
        handlePopUpClose={() => handlePopUpClose('delete')}
        showAlert={showAlert}
        idToDelete={selectedId}
      />
      <EditDeviceModal
        open={openModal.edit}
        title="Editar Empresa"
        handlePopUpClose={() => handlePopUpClose('edit')}
        showAlert={showAlert}
        idToEdit={selectedId}
      />
      <DetailsDeviceModal
        open={openModal.details}
        title="Detalhes da Empresa"
        handlePopUpClose={() => handlePopUpClose('details')}
        showAlert={showAlert}
        idDevice={selectedId}
      />
      <AddSchedulesToDeviceModal
        open={openModal.add}
        title="Adicionar Agendamento"
        handlePopUpClose={() => handlePopUpClose('add')}
        showAlert={showAlert}
        idDevice={selectedId}
      />
    </>
  );
};
