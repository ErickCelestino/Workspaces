import { FC, useCallback, useState } from 'react';
import { SimpleFormModal } from '../simple';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { ErrorResponse, ListPlaylistDto, Playlist } from '@workspaces/domain';
import { ListPlaylistRequest } from '../../../services';
import axios, { AxiosError } from 'axios';
import { ValidationsError } from '../../../shared';
import { useLoggedUser } from '../../../contexts';
import { SearchComboBox } from '../../combo-box';

interface MoveFileToAnotherPlaylistModalProps {
  selectedFiles: { [key: string]: boolean };
  oldPlaylist: string;
  open: boolean;
  handlePopUpClose: () => void;
  title: string;
  showAlert: (message: string, success: boolean) => void;
}

export const MoveFileToAnotherPlaylistModal: FC<
  MoveFileToAnotherPlaylistModalProps
> = ({
  selectedFiles,
  oldPlaylist,
  handlePopUpClose,
  open,
  title,
  showAlert,
}) => {
  const { loggedUser } = useLoggedUser();
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));

  const handleData = useCallback(
    async (data: ListPlaylistDto) => {
      try {
        const result = await ListPlaylistRequest({
          loggedUserId: data.loggedUserId,
          userInput: data.userInput,
          skip: data.skip,
          take: data.take,
        });
        return result;
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

  const searchData = async (input: string) => {
    const result = await handleData({
      loggedUserId: loggedUser?.id ?? '',
      userInput: input,
      skip: 0,
      take: 6,
    });
  };

  const handleList = async (
    searchTerm: string,
    page: number,
    pageSize: number
  ) => {
    const result = await handleData({
      userInput: searchTerm,
      loggedUserId: loggedUser?.id ?? '',
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return result?.playlists.map((playlist) => playlist.name) ?? [];
  };

  return (
    <SimpleFormModal
      height={smDown ? theme.spacing(55) : theme.spacing(53)}
      width={smDown ? '90%' : theme.spacing(80)}
      open={open}
      handlePopUpClose={handlePopUpClose}
      title={title}
    >
      <Box>
        <SearchComboBox
          onSearch={searchData}
          onList={handleList}
          pageSize={6}
        />
      </Box>
    </SimpleFormModal>
  );
};
