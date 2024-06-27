import {
  Box,
  Grid,
  Pagination,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { LayoutBase } from '../../layout';
import { useCallback, useEffect, useState } from 'react';
import {
  ContentFile,
  DownloadContentFileDto,
  DownloadContentFileResponseDto,
  ErrorResponse,
  FileContentType,
  ListContentFileDto,
} from '@workspaces/domain';
import {
  DownloadContentFileRequest,
  ListContentFilesRequest,
  getItemLocalStorage,
} from '../../services';
import { useLoggedUser } from '../../contexts';
import {
  DeleteFileModal,
  DetailsFileModal,
  ListContentFiles,
  MoveFileToDirectoryModal,
  SearchBar,
  ToolbarPureTV,
} from '../../components';
import axios, { AxiosError } from 'axios';
import { useSnackbarAlert } from '../../hooks';
import { DownloadError } from '../../shared';
import { ValidationsError } from '../../shared/validations/utils';

const onDownloadFile = async (input: DownloadContentFileResponseDto) => {
  try {
    const response = await fetch(input.url);
    if (!response.ok) {
      throw new Error('Failed to download file');
    }

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = downloadUrl;
    anchor.download = input.fileName;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error('Erro ao baixar o arquivo:', error);
  }
};

export const ListContanteFilesContainer = () => {
  const [fileList, setFileList] = useState<ContentFile[]>([]);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [directoryId, setDirectoryId] = useState('');
  const [deletePopUp, setDeletePopUp] = useState(false);
  const [detailsPopUp, setDetailsPopUp] = useState(false);
  const [movePopUp, setMovePopUp] = useState(false);
  const [fileId, setFileId] = useState('');

  const theme = useTheme();
  const { loggedUser } = useLoggedUser();
  const { showSnackbarAlert, SnackbarAlert } = useSnackbarAlert();
  const mdDown = useMediaQuery(theme.breakpoints.down('md'));

  const showErrorAlert = useCallback(
    (message: string) => {
      showSnackbarAlert({
        message: message,
        severity: 'error',
      });
    },
    [showSnackbarAlert]
  );

  const handleData = useCallback(
    async (data: ListContentFileDto) => {
      try {
        const result = await ListContentFilesRequest({
          userInput: data.userInput ?? '',
          loggedUserId: data.loggedUserId,
          directoryId: data.directoryId,
          take: data.take,
          skip: data.skip,
        });

        return result;
      } catch (error) {
        console.error(error);
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<ErrorResponse>;
          const errors = ValidationsError(axiosError, 'Arquivos');
          if (errors) {
            showErrorAlert(errors);
          }
        }
      }
    },
    [showErrorAlert]
  );

  const getData = useCallback(async () => {
    const directoryId = getItemLocalStorage('di');
    const result = await handleData({
      directoryId,
      loggedUserId: loggedUser?.id ?? '',
      userInput: '',
    });
    setFileList(result?.files ?? []);
    setDirectoryId(directoryId);
    setTotalPage(result?.totalPages ?? 0);
  }, [loggedUser, handleData]);

  useEffect(() => {
    getData();
  }, [getData]);

  const handlePopUpClose = (types: FileContentType) => {
    switch (types) {
      case 'delete':
        setDeletePopUp(false);
        break;
      case 'details':
        setDetailsPopUp(false);
        break;
      case 'moveFile':
        setMovePopUp(false);
        break;
    }
  };

  const handleFile = async (id: string, types: FileContentType) => {
    switch (types) {
      case 'delete':
        setFileId(id);
        setDeletePopUp(true);
        break;
      case 'details':
        setFileId(id);
        setDetailsPopUp(true);
        break;
      case 'download':
        downloadFile(id);
        break;
      case 'moveFile':
        setFileId(id);
        setMovePopUp(true);
        break;
    }
  };

  const getDownloadFile = async (
    downloadContentFileDto: DownloadContentFileDto
  ) => {
    try {
      const result = await DownloadContentFileRequest(downloadContentFileDto);
      return result;
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        const errors = ValidationsError(axiosError, 'Download');
        if (errors) {
          showErrorAlert(errors);
        }
      }
    }
  };

  const downloadFile = async (id: string) => {
    const dto: DownloadContentFileDto = {
      directoryId,
      idToDownload: id,
      loggedUserId: loggedUser?.id ?? '',
    };

    const url = await getDownloadFile(dto);

    if (url) {
      onDownloadFile(url);
    } else {
      showErrorAlert(DownloadError('PT-BR'));
    }
  };

  const handleChange = async (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    const result = await ListContentFilesRequest({
      userInput: '',
      directoryId: directoryId,
      loggedUserId: loggedUser?.id ?? '',
      skip: (value - 1) * 8,
    });
    setFileList(result.files);
  };

  const searchData = async (input: string) => {
    const result = await handleData({
      directoryId,
      loggedUserId: loggedUser?.id ?? '',
      userInput: input,
    });
    setFileList(result?.files ?? []);
    setTotalPage(result?.totalPages ?? 0);
  };

  return (
    <>
      <DeleteFileModal
        open={deletePopUp}
        directoryId={directoryId}
        onClose={() => handlePopUpClose('delete')}
        idToDelete={fileId}
        loggedUserId={loggedUser?.id ?? ''}
        showErrorAlert={showErrorAlert}
      />
      <DetailsFileModal
        directoryId={directoryId}
        open={detailsPopUp}
        idDetails={fileId}
        loggedUserId={loggedUser?.id ?? ''}
        showErrorAlert={showErrorAlert}
        handlePopUpClose={() => handlePopUpClose('details')}
      />
      <MoveFileToDirectoryModal
        open={movePopUp}
        loggedUserId={loggedUser?.id ?? ''}
        showErrorAlert={showErrorAlert}
        onClose={() => handlePopUpClose('moveFile')}
        idToMove={fileId}
        title="Mover Arquivo para"
        buttonTitle="Mover Arquivo"
      />

      <LayoutBase title="Listagem de Usuários" toolBar={<ToolbarPureTV />}>
        <Box display="flex" justifyContent="center">
          <Box width={mdDown ? '100%' : '90%'}>
            <Box width="95%">
              <SearchBar
                onSearch={searchData}
                placeholder="Pesquisar Arquivo"
              />
              <Box mt={theme.spacing(4)}>
                {fileList.length > 0 ? (
                  <Grid container spacing={2}>
                    {fileList.map((file, index) => (
                      <Grid item md={4} lg={3} key={index}>
                        <ListContentFiles
                          deleteFile={() => handleFile(file.id, 'delete')}
                          detailsFile={() => handleFile(file.id, 'details')}
                          downloadFile={() => handleFile(file.id, 'download')}
                          moveFile={() => handleFile(file.id, 'moveFile')}
                          fileImage={file.path}
                          fileImageName={file.fileName}
                          name={file.originalName}
                          key={file.id}
                        />
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Box
                    marginTop={theme.spacing(2)}
                    width="100%"
                    display="flex"
                    justifyContent="center"
                  >
                    <Typography variant="h4">
                      Não foram encontrados registros
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
            <Box
              marginTop={theme.spacing(2)}
              display="flex"
              justifyContent="end"
            >
              <Pagination
                count={totalPage}
                color="primary"
                onChange={handleChange}
              />
            </Box>
          </Box>
        </Box>
      </LayoutBase>
      {SnackbarAlert}
    </>
  );
};
