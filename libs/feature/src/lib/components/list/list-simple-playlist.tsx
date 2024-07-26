import {
  Avatar,
  Box,
  Collapse,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Pagination,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import {
  ContentFile,
  ErrorResponse,
  FindFilesByPlaylistDto,
  Playlist,
} from '@workspaces/domain';
import { FC, useCallback, useState } from 'react';
import { useLoggedUser } from '../../contexts';
import { FindFilesByPlaylistRequest } from '../../services';
import axios, { AxiosError } from 'axios';
import { ValidationsError } from '../../shared';
import { ScrollBox } from '../scroll';

interface PlaylistItemProps {
  playlists: Playlist[];
  totalPages: number;
  showAlert: (message: string, success: boolean) => void;
  handleChange: (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => Promise<void>;
}

export const ListSimplePlaylist: FC<PlaylistItemProps> = ({
  playlists,
  totalPages,
  showAlert,
  handleChange,
}) => {
  const { loggedUser } = useLoggedUser();
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));
  const [listFiles, setListFiles] = useState<{ [key: string]: ContentFile[] }>(
    {}
  );
  const [openSubItems, setOpenSubItems] = useState<{ [key: string]: boolean }>(
    {}
  );

  const getFilesByPlaylist = useCallback(
    async (input: FindFilesByPlaylistDto) => {
      try {
        const result = await FindFilesByPlaylistRequest(input);
        setListFiles((prevListFiles) => ({
          ...prevListFiles,
          [input.idPlaylist]: result.files,
        }));
      } catch (error) {
        console.error(error);
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<ErrorResponse>;
          const errors = ValidationsError(axiosError, 'Arquivos');
          if (errors) {
            showAlert(errors, false);
          }
        }
      }
    },
    [showAlert]
  );

  const handleToggleSubItems = async (id: string) => {
    if (!openSubItems[id]) {
      getFilesByPlaylist({
        idPlaylist: id,
        loggedUserId: loggedUser?.id ?? '',
      });
    }
    setOpenSubItems((prevOpenSubItems) => ({
      ...prevOpenSubItems,
      [id]: !prevOpenSubItems[id],
    }));
  };

  return (
    <div>
      <ScrollBox maxHeight={theme.spacing(32)}>
        <List>
          {playlists.map((playlist) => (
            <div key={playlist.id}>
              <ListItem>
                <ListItemButton
                  onClick={() => handleToggleSubItems(playlist.id)}
                >
                  <ListItemButton
                    sx={{
                      padding: 0,
                    }}
                    key={playlist.id}
                  >
                    <ListItemText primary={playlist.name} />
                    {openSubItems[playlist.id] ? (
                      <ExpandLess />
                    ) : (
                      <ExpandMore />
                    )}
                  </ListItemButton>
                </ListItemButton>
              </ListItem>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <Collapse
                  sx={{
                    width: '90%',
                  }}
                  in={openSubItems[playlist.id]}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    {listFiles[playlist.id]?.map((file) => (
                      <div>
                        <ListItem
                          sx={{
                            width: '100%',
                          }}
                          key={file.id}
                        >
                          <ListItemAvatar
                            sx={{
                              marginRight: smDown
                                ? theme.spacing(1)
                                : theme.spacing(3),
                            }}
                          >
                            <Avatar
                              sx={{
                                width: theme.spacing(6),
                                height: theme.spacing(6),
                                '& img': {
                                  objectFit: 'contain',
                                  objectPosition: 'center',
                                  maxHeight: '100%',
                                  maxWidth: '100%',
                                },
                              }}
                              src={file.path}
                            />
                          </ListItemAvatar>
                          <ListItemText
                            sx={{
                              overflow: 'hidden',
                              fontSize: smDown ? '8px' : '12px',
                              textOverflow: 'ellipsis',
                            }}
                            primary={file.originalName}
                          />
                        </ListItem>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'center',
                          }}
                        >
                          <Divider
                            sx={{
                              width: '95%',
                            }}
                          />
                        </Box>
                      </div>
                    ))}
                  </List>
                </Collapse>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <Divider
                  sx={{
                    width: '90%',
                  }}
                />
              </Box>
            </div>
          ))}
        </List>
      </ScrollBox>
      <Box
        width={'100%'}
        display="flex"
        justifyContent="center"
        marginTop={theme.spacing(2)}
      >
        <Pagination
          count={totalPages}
          color="primary"
          onChange={handleChange}
        />
      </Box>
    </div>
  );
};
