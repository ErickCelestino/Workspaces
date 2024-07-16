import { FC, useCallback, useEffect, useState } from 'react';
import { SimpleFormModal } from '../simple';
import {
  Box,
  Chip,
  Divider,
  List,
  Pagination,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import OpenWithIcon from '@mui/icons-material/OpenWith';
import {
  ContentFile,
  DetailsPlaylistDto,
  ErrorResponse,
  FindFilesByPlaylistDto,
  IconMenuItem,
  PlaylistResponseDto,
} from '@workspaces/domain';
import {
  DetailsPlaylistRequest,
  FindFilesByPlaylistRequest,
} from '../../../services';
import axios, { AxiosError } from 'axios';
import { formatBrDate, ValidationsError } from '../../../shared';
import { useLoggedUser } from '../../../contexts';
import { ContentFileItem } from '../../list';
import { ButtonFileMenu } from '../../menu';

interface DetailsPlaylistModalProps {
  open: boolean;
  title: string;
  idPlaylist: string;
  filesTitle?: string;
  handlePopUpClose: () => void;
  showAlert: (message: string, success: boolean) => void;
}

export const DetailsPlaylistModal: FC<DetailsPlaylistModalProps> = ({
  handlePopUpClose,
  showAlert,
  idPlaylist,
  filesTitle = 'Arquivos',
  title,
  open,
}) => {
  const [playlistDetails, setPlaylistDetails] = useState<PlaylistResponseDto>(
    {} as PlaylistResponseDto
  );
  const [files, setFiles] = useState<ContentFile[]>([]);
  const [totalPagesFiles, setTotalPagesFiles] = useState(0);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [moveFilePopUp, setMoveFilePopUp] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<{
    [key: string]: boolean;
  }>({});

  const { loggedUser } = useLoggedUser();
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));

  const getPlaylist = useCallback(
    async (input: DetailsPlaylistDto) => {
      try {
        const result = await DetailsPlaylistRequest(input);
        setPlaylistDetails(result);
      } catch (error) {
        console.error(error);
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<ErrorResponse>;
          const errors = ValidationsError(axiosError, 'Playlist');
          if (errors) {
            showAlert(errors, false);
          }
        }
      }
    },
    [showAlert]
  );

  const getFilesByPlaylist = useCallback(
    async (input: FindFilesByPlaylistDto) => {
      try {
        const result = await FindFilesByPlaylistRequest(input);
        setFiles(result.files);
        setTotalPagesFiles(result.totalPages);
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

  const handleChange = async (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    const result = await FindFilesByPlaylistRequest({
      loggedUserId: loggedUser?.id ?? '',
      idPlaylist,
      skip: (value - 1) * 8,
    });
    setFiles(result.files);
  };

  useEffect(() => {
    if (!open) {
      setDataLoaded(false);
    }
  }, [open]);

  useEffect(() => {
    if (open && idPlaylist && !dataLoaded) {
      getPlaylist({
        loggedUserId: loggedUser?.id ?? '',
        playlistId: idPlaylist,
      });
      getFilesByPlaylist({
        idPlaylist,
        loggedUserId: loggedUser?.id ?? '',
      });
    }
  }, [open, idPlaylist, dataLoaded, getPlaylist, loggedUser]);

  const iconMenuList: IconMenuItem[] = [
    {
      icon: <OpenWithIcon />,
      title: 'Mover para',
      handleClick: async () => {},
    },
  ];

  const handleFileToggle = (fileId: string) => {
    setSelectedFiles((prevSelectedFiles) => {
      const newSelectedFiles = {
        ...prevSelectedFiles,
        [fileId]: !prevSelectedFiles[fileId],
      };
      const selectedFileIds = Object.keys(newSelectedFiles).filter(
        (id) => newSelectedFiles[id]
      );
      return newSelectedFiles;
    });
    handlePopUpOpen('move-file');
  };

  const handlePopUpOpen = (types: 'move-file', id?: string) => {
    switch (types) {
      case 'move-file':
        setMoveFilePopUp(true);
        break;
    }
  };
  return (
    <SimpleFormModal
      height={smDown ? theme.spacing(55) : theme.spacing(80)}
      width={smDown ? '90%' : theme.spacing(80)}
      open={open}
      handlePopUpClose={handlePopUpClose}
      title={title}
    >
      <Box sx={{ padding: theme.spacing(2) }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: theme.spacing(2),
          }}
        >
          <Typography
            sx={{
              fontSize: '18px',
            }}
          >
            <strong>Nome: </strong>
            {playlistDetails?.name ?? ''}
          </Typography>
          <Chip
            label={playlistDetails.category?.name ?? ''}
            color="success"
            variant="filled"
            size="medium"
          />
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Typography
            sx={{
              fontSize: '18px',
            }}
          >
            <strong>Criado por: </strong>
            {playlistDetails?.created_by ?? ''}
          </Typography>
          <Typography>
            <strong>Criado em: </strong>
            {formatBrDate(new Date(playlistDetails?.created_at ?? new Date()))}
          </Typography>
        </Box>
        <Divider
          sx={{
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(2),
          }}
        />
        <Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="h5">
              <strong>{filesTitle}</strong>
            </Typography>
            <ButtonFileMenu iconMenuItemList={iconMenuList} />
          </Box>
          <List>
            {files.map((file) => (
              <ContentFileItem
                contentFile={file}
                key={file.id}
                isSelected={!!selectedFiles[file.id]}
                onFileToggle={handleFileToggle}
              />
            ))}
          </List>
          <Box
            width="100%"
            display="flex"
            justifyContent="center"
            marginTop={theme.spacing(2)}
          >
            <Pagination
              count={totalPagesFiles}
              color="primary"
              onChange={handleChange}
            />
          </Box>
        </Box>
      </Box>
    </SimpleFormModal>
  );
};
