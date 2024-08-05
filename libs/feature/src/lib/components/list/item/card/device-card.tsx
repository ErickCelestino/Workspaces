import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { FC } from 'react';
import { IconMenuItem } from '@workspaces/domain';
import { SimpleCardItem } from '../../../card';

interface DeviceCardProps {
  name: string;
  editTitle?: string;
  deleteTitle?: string;
  deleteDevice: () => Promise<void>;
  editDevice: () => Promise<void>;
}

export const DeviceCard: FC<DeviceCardProps> = ({
  name,
  deleteDevice,
  editDevice,
  editTitle = 'Editar',
  deleteTitle = 'Deletar',
}) => {
  const iconMenuList: IconMenuItem[] = [
    {
      icon: <DeleteIcon />,
      title: deleteTitle,
      handleClick: deleteDevice,
    },
    {
      icon: <EditIcon />,
      title: editTitle,
      handleClick: editDevice,
    },
  ];

  return (
    <SimpleCardItem
      iconMenuList={iconMenuList}
      imageData={{
        image: '',
        imageName: 'device',
      }}
      name={name}
    />
  );
};
