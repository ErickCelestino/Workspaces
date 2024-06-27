import { DrawerOption, DrawerTopic } from '@workspaces/domain';
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Icon,
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate } from 'react-router-dom';
import { useDrawerContext } from '../../contexts';
import { useEffect, useState } from 'react';

interface DrawerListItemProps {
  items: DrawerTopic;
  open: boolean;
  onClick: (() => void) | undefined;
}

export const DrawerListItem = ({
  items,
  open,
  onClick,
}: DrawerListItemProps) => {
  const { isDrawerOpen, toggleDrawerOpen } = useDrawerContext();
  const [buttonsDrawer, setButtonsDrawer] = useState<DrawerOption[]>([]);

  useEffect(() => {
    if (!isDrawerOpen) {
      let listItem: DrawerOption[] = [];
      Object.keys(items).forEach((topic) => {
        items[topic].forEach(({ label, icon, path }) => {
          listItem.push({
            icon,
            label,
            path,
          });
        });
      });
      setButtonsDrawer(listItem);
    }
  }, [isDrawerOpen, items]);

  const navigate = useNavigate();

  const handleClick = (to: string) => {
    return () => {
      navigate(to);
      onClick?.();
    };
  };

  return (
    <>
      {isDrawerOpen
        ? Object.keys(items).map((topic) => (
            <Accordion key={topic}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`${topic}-content`}
                id={`${topic}-header`}
              >
                <Typography>{topic}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {items[topic].map(({ label, icon, path }) => (
                  <ListItem
                    key={label}
                    disablePadding
                    sx={{ display: 'block' }}
                  >
                    <ListItemButton
                      onClick={
                        isDrawerOpen ? handleClick(path) : toggleDrawerOpen
                      }
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? 'initial' : 'center',
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 2 : 'auto',
                          justifyContent: 'center',
                        }}
                      >
                        <Icon>{icon}</Icon>
                      </ListItemIcon>
                      <ListItemText
                        primary={label}
                        sx={{ opacity: open ? 1 : 0 }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </AccordionDetails>
            </Accordion>
          ))
        : buttonsDrawer.map(({ label, icon, path }) => (
            <ListItem key={label} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                onClick={isDrawerOpen ? handleClick(path) : toggleDrawerOpen}
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

/*
      {items.map(({ label, icon, path }) => (
        <ListItem key={label} disablePadding sx={{ display: 'block' }}>
          <ListItemButton
            onClick={isDrawerOpen ? handleClick(path) : toggleDrawerOpen}
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
*/
/*
      {Object.keys(items).map((topic) => (
        <Accordion key={topic}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`${topic}-content`}
            id={`${topic}-header`}
          >
            <Typography>{topic}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {items[topic].map(({ label, icon, path }) => (
              <ListItem key={label} disablePadding sx={{ display: 'block' }}>
                <ListItemButton
                  onClick={isDrawerOpen ? handleClick(path) : toggleDrawerOpen}
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
          </AccordionDetails>
        </Accordion>
      ))}
*/
