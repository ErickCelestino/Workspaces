import {
  Box,
  Divider,
  Fade,
  IconButton,
  Modal,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { FC, useEffect, useState } from 'react';
import {
  ContentFile,
  DetailsContentFileDto,
  ErrorResponse,
} from '@workspaces/domain';
import CloseIcon from '@mui/icons-material/Close';
import DescriptionIcon from '@mui/icons-material/Description';
import FormatSizeIcon from '@mui/icons-material/FormatSize';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AttachmentIcon from '@mui/icons-material/Attachment';
import { DetailsContentFileRequest } from '../../../services';
import axios, { AxiosError } from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import { FormEditContentFile } from '../../form';
import { ValidationsError } from '../../../shared';

interface DetailsFileModalPros {
  showErrorAlert: (message: string) => void;
  handlePopUpClose: () => void;
  open: boolean;
  directoryId: string;
  idDetails: string;
  loggedUserId: string;
  title?: string;
  fileNameTitle?: string;
  formatFileTitle?: string;
  sizeFileTitle?: string;
  uploadDateTitle?: string;
}

export const DetailsFileModal: FC<DetailsFileModalPros> = ({
  showErrorAlert,
  handlePopUpClose,
  open,
  directoryId,
  idDetails,
  loggedUserId,
  title = 'Detalhes do Arquivo',
  fileNameTitle = 'Nome do Arquivo',
  formatFileTitle = 'Formato do Arquivo',
  sizeFileTitle = 'Tamanho do Arquivo',
  uploadDateTitle = 'Data de Upload',
}) => {
  const [detailsFile, setDetailsFile] = useState<ContentFile>();
  const [editFileName, setEditFileName] = useState<boolean>(false);
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));

  const handleEditFileName = () => {
    setEditFileName(!editFileName);
  };

  const editSuccess = () => {
    setEditFileName(false);
  };

  useEffect(() => {
    const getContentFile = async () => {
      try {
        const dto: DetailsContentFileDto = {
          directoryId,
          id: idDetails,
          loggedUserId,
        };
        const result = await DetailsContentFileRequest(dto);
        const formattedUploadDate = result.uploadDate
          ? new Date(result.uploadDate).toISOString().split('T')[0]
          : new Date();
        setDetailsFile({
          ...result,
          uploadDate: formattedUploadDate as Date,
        });
      } catch (error) {
        console.error(error);
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<ErrorResponse>;
          const errors = ValidationsError(axiosError, 'arquivo ou diretório');
          if (errors) {
            showErrorAlert(errors);
          }
        }
      }
    };

    if (open) {
      getContentFile();
    }
  }, [directoryId, idDetails, loggedUserId, open, showErrorAlert]);

  return (
    <Modal open={open} onClose={handlePopUpClose} closeAfterTransition>
      <Fade in={open}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            height: theme.spacing(45),
            width: smDown ? '90%' : theme.spacing(80),
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
              p: 2,
              borderRadius: 1,
            }}
          >
            <Typography
              noWrap
              textOverflow="ellipsis"
              overflow="hidden"
              variant="h5"
            >
              <strong>{title}</strong>
            </Typography>
            <IconButton onClick={handlePopUpClose}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider />
          <Box sx={{ mt: 2 }}>
            {!editFileName ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <Box
                  component="div"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'row',
                  }}
                >
                  <DescriptionIcon />
                  <Typography
                    noWrap
                    textOverflow="ellipsis"
                    overflow="hidden"
                    maxWidth={smDown ? theme.spacing(45) : theme.spacing(50)}
                    marginLeft={theme.spacing(2)}
                    variant={smDown ? 'body1' : 'h6'}
                  >
                    <strong>{fileNameTitle}:</strong>{' '}
                    {detailsFile?.originalName}
                  </Typography>
                </Box>
                <IconButton onClick={handleEditFileName}>
                  <EditIcon />
                </IconButton>
              </Box>
            ) : (
              <FormEditContentFile
                onEditSuccess={editSuccess}
                directoryId={directoryId}
                idToEdit={idDetails}
                loggedUserId={loggedUserId}
                showErrorAlert={showErrorAlert}
                handleEditFileName={handleEditFileName}
              />
            )}
            <Box
              component="div"
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                mt: theme.spacing(2),
              }}
            >
              <FormatSizeIcon />
              <Typography
                noWrap
                textOverflow="ellipsis"
                overflow="hidden"
                maxWidth={theme.spacing(50)}
                marginLeft={theme.spacing(2)}
                variant={smDown ? 'body1' : 'h6'}
              >
                <strong>{formatFileTitle}:</strong> {detailsFile?.format}
              </Typography>
            </Box>
            <Box
              component="div"
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                mt: theme.spacing(2),
              }}
            >
              <AttachmentIcon />
              <Typography
                noWrap
                textOverflow="ellipsis"
                overflow="hidden"
                maxWidth={theme.spacing(50)}
                marginLeft={theme.spacing(2)}
                variant={smDown ? 'body1' : 'h6'}
              >
                <strong>{sizeFileTitle}:</strong> {detailsFile?.size}
              </Typography>
            </Box>
            <Box
              component="div"
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                mt: theme.spacing(2),
              }}
            >
              <CalendarTodayIcon />
              <Typography
                noWrap
                textOverflow="ellipsis"
                overflow="hidden"
                maxWidth={theme.spacing(50)}
                marginLeft={theme.spacing(2)}
                variant={smDown ? 'body1' : 'h6'}
              >
                <strong>{uploadDateTitle}:</strong>{' '}
                {detailsFile?.uploadDate.toString()}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};
