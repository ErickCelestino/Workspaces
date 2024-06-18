import {
  Box,
  Grid,
  Pagination,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { LayoutBase } from '../../layout';
import { useEffect, useState } from 'react';
import {
  ContentFile,
  ErrorResponse,
  ListContentFileDto,
} from '@workspaces/domain';
import { ListContentFilesRequest, getItemLocalStorage } from '../../services';
import { useLoggedUser } from '../../contexts';
import {
  DeleteFileModal,
  ListContentFiles,
  SearchBar,
  ToolbarPureTV,
} from '../../components';
import axios, { AxiosError } from 'axios';
import { useSnackbarAlert } from '../../hooks';
import {
  ConnectionError,
  EntityNotAllowed,
  EntityNotCreated,
  EntityNotEmpty,
} from '../../shared';

export const ListContanteFilesContainer = () => {
  const [fileList, setFileList] = useState<ContentFile[]>([]);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [directoryId, setDirectoryId] = useState('');
  const [deletePopUp, setDeletePopUp] = useState(false);
  const [fileId, setFileId] = useState('');

  const theme = useTheme();
  const { loggedUser } = useLoggedUser();
  const { showSnackbarAlert, SnackbarAlert } = useSnackbarAlert();
  const mdDown = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    getData();
  }, [loggedUser]);

  const showErrorAlert = (message: string) => {
    showSnackbarAlert({
      message: message,
      severity: 'error',
    });
  };
  const getData = async () => {
    const directoryId = getItemLocalStorage('di');
    const result = await handleData({
      directoryId,
      loggedUserId: loggedUser?.id ?? '',
      userInput: '',
    });
    setFileList(result?.files ?? []);
    setDirectoryId(directoryId);
    setTotalPage(result?.totalPages ?? 0);
  };

  const handleData = async (data: ListContentFileDto) => {
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
        switch (axiosError.response?.data.error.name) {
          case 'EntityNotEmpty':
            showErrorAlert(EntityNotEmpty('Arquivos', 'PT-BR'));
            break;

          case 'EntityNotCreated':
            showErrorAlert(EntityNotCreated('Arquivos', 'PT-BR'));
            break;

          case 'FileNotAllowed':
            showErrorAlert(EntityNotAllowed('Arquivos', 'PT-BR'));
            break;

          default:
            showErrorAlert(ConnectionError('PT-BR'));
            break;
        }
      }
    }
  };

  const handlePopUpClose = () => {
    setDeletePopUp(false);
  };

  const handleDeleteFile = async (id: string) => {
    setFileId(id);
    setDeletePopUp(true);
  };

  const handleDetailsFile = async (id: string) => {
    /// More details implementation
  };

  const handleDownloadFile = async (id: string) => {
    /// More details implementation
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
        deletePopUp={deletePopUp}
        directoryId={directoryId}
        handlePopUpClose={handlePopUpClose}
        idToDelete={fileId}
        loggedUserId={loggedUser?.id ?? ''}
        showErrorAlert={showErrorAlert}
        onDeleteSuccess={getData}
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
                          deleteFile={() => handleDeleteFile(file.id)}
                          detailsFile={() => handleDetailsFile(file.id)}
                          downloadFile={() => handleDownloadFile(file.id)}
                          fileImage={`http://localhost:3000/${file.fileName}`}
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
