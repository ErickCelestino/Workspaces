import {
  Avatar,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
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
}

export const ListSimpleDirectory: FC<ListSimpleDirectoryProps> = ({
  listDirectories,
  showAlert,
}) => {
  const [filesList, setFilesList] = useState<ContentFile[]>([]);
  const [openSubItems, setOpenSubItems] = useState<{ [key: string]: boolean }>(
    {}
  );
  const { loggedUser } = useLoggedUser();

  const getFiles = useCallback(
    async (input: ListContentFileDto) => {
      try {
        const result = await ListContentFilesRequest(input);
        setFilesList(result.files);
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
    await getFiles({
      directoryId: id,
      loggedUserId: loggedUser?.id ?? '',
      userInput: '',
    });
    setOpenSubItems((prevOpenSubItems) => ({
      ...prevOpenSubItems,
      [id]: !prevOpenSubItems[id],
    }));
  };

  return (
    <ScrollBox>
      <List>
        {listDirectories.map((directory) => (
          <ListItemButton
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
        ))}
      </List>
    </ScrollBox>
  );
};
