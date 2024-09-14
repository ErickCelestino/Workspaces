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
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import OpenWithIcon from '@mui/icons-material/OpenWith';
import FolderOffIcon from '@mui/icons-material/FolderOff';
import {
  DetailsPlaylistDto,
  ErrorResponse,
  IconMenuItem,
  PlaylistResponseDto,
} from '@workspaces/domain';
import { DetailsPlaylistRequest } from '../../../services';
import axios, { AxiosError } from 'axios';
import { formatBrDate, ValidationsError } from '../../../shared';
import { useLoggedUser } from '../../../contexts';
import { ContentFileItem, EmptyListResponse } from '../../list';
import { ButtonFileMenu } from '../../menu';
import { FileToPlaylistModals } from '../file-to-playlist';
import { useFilesByPlaylistData } from '../../../hooks';

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
  const [dataLoaded, setDataLoaded] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<Record<string, boolean>>(
    {}
  );
  const [openModal, setOpenModal] = useState({
    move: false,
    delete: false,
  });

  const { loggedUser } = useLoggedUser();
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));

  const { listFiles, totalPage, getData } = useFilesByPlaylistData({
    showAlert,
    loggedUserId: loggedUser?.id ?? '',
    playlistId: idPlaylist,
  });

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

  const renderFilesByPlaylist = () =>
    listFiles.length > 0 ? (
      listFiles.map((file) => (
        <ContentFileItem
          contentFile={file}
          key={file.id}
          isSelected={!!selectedFiles[file.id]}
          onFileToggle={handleFileToggle}
        />
      ))
    ) : (
      <EmptyListResponse
        message="Sem Arquivos"
        icon={
          <FolderOffIcon
            sx={{
              fontSize: theme.spacing(10),
            }}
          />
        }
      />
    );

  const getSelectedFilesIds = () => {
    return Object.keys(selectedFiles).filter((fileId) => selectedFiles[fileId]);
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
      getData();
    }
  }, [open, idPlaylist, dataLoaded, getPlaylist, loggedUser, getData]);

  const handleFileToggle = (fileId: string) => {
    setSelectedFiles((prevSelectedFiles) => {
      const newSelectedFiles = {
        ...prevSelectedFiles,
        [fileId]: !prevSelectedFiles[fileId],
      };
      return newSelectedFiles;
    });
  };

  const handleChange = async (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    getData('', value);
  };

  const handlePopUpFilesClose = async (type: 'move' | 'delete') => {
    setOpenModal((prev) => ({
      ...prev,
      [type]: false,
    }));
    getData();
  };

  const handlePopUpOpen = async (type: 'move' | 'delete', id?: string) => {
    const selecteFileMessage = 'Selecione um arquivo para mover';
    if (getSelectedFilesIds().length > 0) {
      setOpenModal((prev) => ({
        ...prev,
        [type]: true,
      }));
    } else {
      showAlert(selecteFileMessage, false);
    }
  };

  const iconMenuList: IconMenuItem[] = [
    {
      icon: <OpenWithIcon />,
      title: 'Mover para',
      handleClick: async () => handlePopUpOpen('move'),
    },
    {
      icon: <DeleteSweepIcon />,
      title: 'Deletar Arquivos',
      handleClick: async () => handlePopUpOpen('delete'),
    },
  ];
  return (
    <>
      <FileToPlaylistModals
        selectedIds={selectedFiles}
        getSelectedFilesIds={getSelectedFilesIds}
        handlePopUpClose={handlePopUpFilesClose}
        oldPlaylist={idPlaylist}
        openModal={openModal}
        showAlert={showAlert}
        deletePlaylistFilesSubTitle={`Deseja realmente deletar os ${
          getSelectedFilesIds().length
        } arquivos selecionados?`}
      />
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
              {formatBrDate(
                new Date(playlistDetails?.created_at ?? new Date())
              )}
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
            <List>{renderFilesByPlaylist()}</List>
            <Box
              width="100%"
              display="flex"
              justifyContent="center"
              marginTop={theme.spacing(2)}
            >
              <Pagination
                count={totalPage}
                color="primary"
                onChange={handleChange}
              />
            </Box>
          </Box>
        </Box>
      </SimpleFormModal>
    </>
  );
};
