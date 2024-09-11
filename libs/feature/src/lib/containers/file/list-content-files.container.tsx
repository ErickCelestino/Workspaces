import {
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Icon,
  IconButton,
  useTheme,
} from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { LayoutBase } from '../../layout';
import { useCallback, useEffect, useState } from 'react';
import {
  ContentFile,
  CrudType,
  DownloadContentFileDto,
  DownloadContentFileResponseDto,
  ErrorResponse,
  FileContentType,
  IconMenuItem,
  ListContentFileDto,
} from '@workspaces/domain';
import {
  DownloadContentFileRequest,
  ListContentFilesRequest,
  getItemLocalStorage,
} from '../../services';
import { useFileModal, useLoggedUser } from '../../contexts';
import {
  ContentFileCard,
  CreateDirectoryModal,
  DeleteFileModal,
  DetailsFileModal,
  EmptyListResponse,
  ListDirectory,
  MoveFileToDirectoryModal,
  ToolbarPureTV,
} from '../../components';
import axios, { AxiosError } from 'axios';
import { useSnackbarAlert } from '../../hooks';
import { DownloadError } from '../../shared';
import { ValidationsError } from '../../shared/validations/utils';
import { ContainerCardList } from '../utils';

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
  const [directoryId, setLocalDirectoryId] = useState('');
  const [deletePopUp, setDeletePopUp] = useState(false);
  const [detailsPopUp, setDetailsPopUp] = useState(false);
  const [createDirectoryPopUp, setCreateDirectoryPopUp] = useState(false);
  const [movePopUp, setMovePopUp] = useState(false);
  const [fileId, setFileId] = useState('');
  const [directoyPopUp, setDirectoryPopUp] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const theme = useTheme();
  const { loggedUser } = useLoggedUser();
  const { showSnackbarAlert, SnackbarAlert } = useSnackbarAlert();
  const { handleOpen, setDirectoryId } = useFileModal();

  const showAlert = useCallback(
    (message: string, success: boolean) => {
      showSnackbarAlert({
        message: message,
        severity: success ? 'success' : 'error',
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
          companyId: data.companyId,
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
            showAlert(errors, false);
          }
        }
      }
    },
    [showAlert]
  );

  const getData = useCallback(async () => {
    const directoryId = getItemLocalStorage('di');
    const result = await handleData({
      directoryId: directoryId ?? '',
      companyId: loggedUser?.selectedCompany.id ?? '',
      loggedUserId: loggedUser?.id ?? '',
      userInput: '',
    });
    if (result) {
      setFileList(result?.files ?? []);
      setLocalDirectoryId(directoryId);
      setTotalPage(result?.totalPages ?? 0);
    }
  }, [loggedUser, handleData]);

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

  const handleFile = async (types: FileContentType, id?: string) => {
    const selectedId = id ?? '';
    switch (types) {
      case 'delete':
        setFileId(selectedId);
        setDeletePopUp(true);
        break;
      case 'details':
        setFileId(selectedId);
        setDetailsPopUp(true);
        break;
      case 'download':
        downloadFile(selectedId);
        break;
      case 'moveFile':
        setFileId(selectedId);
        setMovePopUp(true);
        break;
      case 'create':
        setDirectoryId(directoryId);
        handleOpen();
        break;
    }
  };

  const handleDirectoryPopUpOpen = (types: CrudType | 'changeDirectory') => {
    switch (types) {
      case 'create':
        setCreateDirectoryPopUp(true);
        break;
      case 'changeDirectory':
        setDirectoryPopUp(true);
        break;
    }
  };

  const handleDirectoryPopUpClose = (types: CrudType | 'changeDirectory') => {
    switch (types) {
      case 'create':
        setCreateDirectoryPopUp(false);
        break;
      case 'changeDirectory':
        setDirectoryPopUp(false);
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
          showAlert(errors, false);
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
      showAlert(DownloadError('PT-BR'), true);
    }
  };

  const handleChange = async (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    const result = await ListContentFilesRequest({
      userInput: '',
      directoryId: directoryId,
      companyId: loggedUser?.selectedCompany.id ?? '',
      loggedUserId: loggedUser?.id ?? '',
      skip: (value - 1) * 8,
    });
    setTotalPage(result.totalPages);
    setFileList(result.files);
    setTotalPage(result.totalPages);
  };

  const searchData = async (input: string) => {
    const result = await handleData({
      directoryId,
      companyId: loggedUser?.selectedCompany.id ?? '',
      loggedUserId: loggedUser?.id ?? '',
      userInput: input,
    });
    setFileList(result?.files ?? []);
    setTotalPage(result?.totalPages ?? 0);
  };

  useEffect(() => {
    setIsMounted(false);
  }, [loggedUser?.selectedCompany.id]);

  useEffect(() => {
    if (!isMounted) {
      getData();
      setIsMounted(true);
    }
  }, [isMounted, getData]);

  const rightClickMenuList: IconMenuItem[] = [
    {
      icon: <Icon>create_new_folder</Icon>,
      title: 'Novo Diretório',
      handleClick: async () => handleDirectoryPopUpOpen('create'),
    },
    {
      icon: <Icon>note_add</Icon>,
      title: 'Novo Arquivo',
      handleClick: async () => handleFile('create'),
    },
  ];
  return (
    <>
      <DeleteFileModal
        open={deletePopUp}
        directoryId={directoryId}
        onClose={() => handlePopUpClose('delete')}
        idToDelete={fileId}
        loggedUserId={loggedUser?.id ?? ''}
        showAlert={showAlert}
      />
      <DetailsFileModal
        directoryId={directoryId}
        open={detailsPopUp}
        idDetails={fileId}
        loggedUserId={loggedUser?.id ?? ''}
        showAlert={showAlert}
        handlePopUpClose={() => handlePopUpClose('details')}
      />
      <MoveFileToDirectoryModal
        open={movePopUp}
        loggedUserId={loggedUser?.id ?? ''}
        showAlert={showAlert}
        onClose={() => handlePopUpClose('moveFile')}
        idToMove={fileId}
        title="Mover Arquivo para"
        buttonTitle="Mover Arquivo"
      />
      <CreateDirectoryModal
        open={createDirectoryPopUp}
        showAlert={showAlert}
        handlePopUpClose={() => handleDirectoryPopUpClose('create')}
        title="Criar Diretório"
      />
      <Dialog
        open={directoyPopUp}
        onClose={() => handleDirectoryPopUpClose('changeDirectory')}
      >
        <DialogTitle>
          Selecione um Diretório
          <IconButton
            aria-label="close"
            onClick={() => handleDirectoryPopUpClose('changeDirectory')}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <Icon>close_icon</Icon>
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <ListDirectory getDataInput={getData} />
        </DialogContent>
      </Dialog>
      <LayoutBase
        title="Listagem de Arquivos"
        iconMenuItemList={rightClickMenuList}
        toolBar={<ToolbarPureTV />}
      >
        <ContainerCardList
          search={{
            searchData: searchData,
            placeholder: 'Pesquisar Arquivo',
            createPopUp: () => handleFile('create'),
          }}
          totalPage={totalPage}
          handleChange={handleChange}
          mobileBackButtom
          changeDirectory
          handleDirectoryPopUpOpen={() =>
            handleDirectoryPopUpOpen('changeDirectory')
          }
        >
          {fileList.length > 0 ? (
            <Grid justifyContent="center" container spacing={2}>
              {fileList.map((file, index) => (
                <Grid item md={6} lg={4} xl={3} key={index}>
                  <ContentFileCard
                    deleteFile={() => handleFile('delete', file.id)}
                    detailsFile={() => handleFile('details', file.id)}
                    downloadFile={() => handleFile('download', file.id)}
                    moveFile={() => handleFile('moveFile', file.id)}
                    fileImage={
                      !file.format.startsWith('video/')
                        ? file.path ?? ''
                        : file.thumbnail ?? ''
                    }
                    fileImageName={file.originalName}
                    name={file.originalName}
                    key={file.id}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <EmptyListResponse
              message="Sem Arquivos"
              icon={
                <AttachFileIcon
                  sx={{
                    fontSize: theme.spacing(10),
                  }}
                />
              }
            />
          )}
        </ContainerCardList>
      </LayoutBase>
      {SnackbarAlert}
    </>
  );
};
