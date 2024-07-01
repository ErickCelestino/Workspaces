import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
  useTheme,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconMenuItem, PlaylistCategory } from '@workspaces/domain';
import { FC } from 'react';
import { ScrollBox } from '../scroll';
import { formatBrDate } from '../../shared';
import { ButtonFileMenu } from '../menu';

interface ListPlaylistCategoryProps {
  list: PlaylistCategory[];
  titleDescription?: string;
  titleCreatedBy?: string;
  titleCreatedAt?: string;
}

export const ListPlaylistCategory: FC<ListPlaylistCategoryProps> = ({
  list,
  titleDescription = 'Descrição',
  titleCreatedBy = 'Criado por',
  titleCreatedAt = 'Criado em',
}) => {
  const theme = useTheme();

  const deletePlaylistCategory = async () => {
    //More Delete Implementation
  };

  const editPlaylistCategory = async () => {
    //More Edit Implementation
  };

  const iconMenuList: IconMenuItem[] = [
    {
      icon: <EditIcon />,
      title: 'Editar',
      handleClick: editPlaylistCategory,
    },
    {
      icon: <DeleteIcon />,
      title: 'Deletar',
      handleClick: deletePlaylistCategory,
    },
  ];
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
      }}
    >
      <Box width="60%">
        <ScrollBox maxHeight="100%">
          <List>
            {list.map((category) => (
              <Box key={category.id}>
                <ListItem>
                  <ListItemText
                    primary={category.name}
                    secondary={
                      <Box
                        component="span"
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                        }}
                      >
                        <Box
                          component="span"
                          sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <Box component="span">
                            <Typography
                              sx={{ display: 'inline' }}
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              {titleCreatedBy}:
                            </Typography>
                            <Typography
                              sx={{ display: 'inline', marginLeft: '4px' }}
                              component="span"
                              variant="body2"
                              color="text.secondary"
                            >
                              {category.created_by}
                            </Typography>
                          </Box>
                          <Box component="span">
                            <Typography
                              sx={{ display: 'inline' }}
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              {titleCreatedAt}:
                            </Typography>
                            <Typography
                              sx={{ display: 'inline', marginLeft: '4px' }}
                              component="span"
                              variant="body2"
                              color="text.secondary"
                            >
                              {formatBrDate(new Date(category.created_at))}
                            </Typography>
                          </Box>
                        </Box>
                        <Box
                          component="span"
                          sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}
                        >
                          <Typography
                            sx={{ display: 'inline' }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            {titleDescription}:
                          </Typography>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              display: 'inline-block',
                              width: '100%',
                              maxHeight: theme.spacing(6),
                              marginLeft: '4px',
                              wordWrap: 'break-word',
                              overflowY: 'auto',
                            }}
                          >
                            {category.description}
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                  <Box
                    sx={{
                      marginLeft: theme.spacing(2),
                    }}
                  >
                    <ButtonFileMenu iconMenuItemList={iconMenuList} />
                  </Box>
                </ListItem>
                <Divider variant="inset" component="li" />
              </Box>
            ))}
          </List>
        </ScrollBox>
      </Box>
    </Box>
  );
};
