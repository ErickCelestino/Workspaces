import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Collapse,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { FC, useCallback, useState } from 'react';
import {
  ContentFile,
  ErrorResponse,
  ListContentFileDto,
  ListDirectoryNameResponseDto,
} from '@workspaces/domain';
import { useLoggedUser } from '../../contexts';
import { ListContentFilesRequest } from '../../services';
import axios, { AxiosError } from 'axios';
import { ValidationsError } from '../../shared';
import { ScrollBox } from '../scroll';

interface ListSimpleDirectoryProps {
  listDirectories: ListDirectoryNameResponseDto[];
  showAlert: (message: string, success: boolean) => void;
  buttonTitle?: string;
}

export const ListSimpleDirectory: FC<ListSimpleDirectoryProps> = ({
  listDirectories,
  showAlert,
  buttonTitle = 'Adicionar à Playlist',
}) => {
  const [listFiles, setListFiles] = useState<{ [key: string]: ContentFile[] }>(
    {}
  );
  const [openSubItems, setOpenSubItems] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [selectedFiles, setSelectedFiles] = useState<{
    [key: string]: boolean;
  }>({});
  const { loggedUser } = useLoggedUser();
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));

  const getFiles = useCallback(
    async (input: ListContentFileDto) => {
      try {
        const result = await ListContentFilesRequest(input);
        setListFiles((prevListFiles) => ({
          ...prevListFiles,
          [input.directoryId]: result.files,
        }));
      } catch (error) {
        console.error(error);
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<ErrorResponse>;
          const errors = ValidationsError(axiosError, 'Category');
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
      await getFiles({
        directoryId: id,
        loggedUserId: loggedUser?.id ?? '',
        userInput: '',
      });
    }
    setOpenSubItems((prevOpenSubItems) => ({
      ...prevOpenSubItems,
      [id]: !prevOpenSubItems[id],
    }));
  };

  const handleFileToggle = (fileId: string) => {
    setSelectedFiles((prevSelectedFiles) => ({
      ...prevSelectedFiles,
      [fileId]: !prevSelectedFiles[fileId],
    }));
  };

  const handleDirectoryToggle = (directoryId: string) => {
    const allFiles = listFiles[directoryId] || [];
    const allSelected = allFiles.every((file) => selectedFiles[file.id]);
    const newSelectedFiles = { ...selectedFiles };

    allFiles.forEach((file) => {
      newSelectedFiles[file.id] = !allSelected;
    });

    setSelectedFiles(newSelectedFiles);
  };

  const handleButtonClick = () => {
    const selectedFileIds = Object.keys(selectedFiles).filter(
      (fileId) => selectedFiles[fileId]
    );
    console.log('Selected file IDs:', selectedFileIds);
    // Você pode fazer algo com os IDs dos arquivos selecionados, como enviá-los para uma API
  };

  return (
    <>
      <ScrollBox height={smDown ? theme.spacing(30) : theme.spacing(43)}>
        <List>
          {listDirectories.map((directory) => (
            <div key={directory.id}>
              <ListItem>
                {openSubItems[directory.id] && (
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={
                        listFiles[directory.id]?.length > 0 &&
                        listFiles[directory.id].every(
                          (file) => selectedFiles[file.id]
                        )
                      }
                      onChange={() => handleDirectoryToggle(directory.id)}
                    />
                  </ListItemIcon>
                )}
                <ListItemButton
                  sx={{
                    marginLeft: openSubItems[directory.id]
                      ? theme.spacing(-5)
                      : 0,
                  }}
                  key={directory.id}
                  onClick={() => handleToggleSubItems(directory.id)}
                >
                  <ListItemAvatar>
                    <Avatar>
                      <FolderIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={directory.name} />
                  {openSubItems[directory.id] ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
              </ListItem>
              <Collapse
                in={openSubItems[directory.id]}
                timeout="auto"
                unmountOnExit
              >
                <List
                  component="div"
                  disablePadding
                  sx={{
                    marginLeft: smDown ? theme.spacing(1) : theme.spacing(3),
                  }}
                >
                  {listFiles[directory.id]?.map((file) => (
                    <ListItem key={file.id}>
                      <ListItemIcon
                        sx={{
                          marginRight: smDown
                            ? theme.spacing(-2)
                            : theme.spacing(0),
                        }}
                      >
                        <Checkbox
                          edge="start"
                          checked={!!selectedFiles[file.id]}
                          onChange={() => handleFileToggle(file.id)}
                        />
                      </ListItemIcon>
                      <ListItemAvatar
                        sx={{
                          marginRight: smDown
                            ? theme.spacing(1)
                            : theme.spacing(3),
                        }}
                      >
                        <Avatar
                          sx={{
                            width: theme.spacing(8),
                            height: theme.spacing(8),
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
                          fontSize: smDown ? '8px' : '16px',
                          textOverflow: 'ellipsis',
                        }}
                        primary={file.originalName}
                      />
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </div>
          ))}
        </List>
      </ScrollBox>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          marginTop: 'auto',
          justifyContent: 'center',
        }}
      >
        <Button variant="contained" onClick={handleButtonClick}>
          {buttonTitle}
        </Button>
      </Box>
    </>
  );
};
