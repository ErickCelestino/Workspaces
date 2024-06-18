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
import { ListContentFiles, SearchBar, ToolbarPureTV } from '../../components';
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

  const theme = useTheme();
  const { loggedUser } = useLoggedUser();
  const { showSnackbarAlert, SnackbarAlert } = useSnackbarAlert();
  const mdDown = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
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
    getData();
  }, [loggedUser]);

  const showErrorAlert = (message: string) => {
    showSnackbarAlert({
      message: message,
      severity: 'error',
    });
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
    console.log(result?.totalPages);
    setFileList(result?.files ?? []);
    setTotalPage(result?.totalPages ?? 0);
  };

  return (
    <>
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
