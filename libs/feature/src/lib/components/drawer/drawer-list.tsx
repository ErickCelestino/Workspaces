import { DrawerOption } from '@workspaces/domain';
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Icon,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface DrawerListItemProps {
  items: DrawerOption[];
  open: boolean;
  onClick: (() => void) | undefined;
}

export const DrawerListItem = ({
  items,
  open,
  onClick,
}: DrawerListItemProps) => {
  const navigate = useNavigate();
  const handleClick = (to: string) => {
    return () => {
      navigate(to);
      onClick?.();
    };
  };

  return (
    <>
      {items.map(({ label, icon, path }) => (
        <ListItem key={label} disablePadding sx={{ display: 'block' }}>
          <ListItemButton
            onClick={handleClick(path)}
            sx={{
              minHeight: 48,
              justifyContent: open ? 'initial' : 'center',
              px: 2.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : 'auto',
                justifyContent: 'center',
              }}
            >
              <Icon>{icon}</Icon>
            </ListItemIcon>
            <ListItemText primary={label} sx={{ opacity: open ? 1 : 0 }} />
          </ListItemButton>
        </ListItem>
      ))}
    </>
  );
};
