import {
  Box,
  Divider,
  Fade,
  Grid,
  IconButton,
  Modal,
  TextField,
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
import CancelIcon from '@mui/icons-material/Cancel';
import { DetailsContentFileRequest } from '../../../services';
import axios, { AxiosError } from 'axios';
import {
  ConnectionError,
  EntityNotEmpty,
  EntityNotExist,
} from '../../../shared';
import EditIcon from '@mui/icons-material/Edit';
import { useForm } from 'react-hook-form';

interface DetailsFileModalPros {
  showErrorAlert: (message: string) => void;
  handlePopUpClose: () => void;
  open: boolean;
  directoryId: string;
  idDetails: string;
  loggedUserId: string;
}

export const DetailsFileModal: FC<DetailsFileModalPros> = ({
  showErrorAlert,
  handlePopUpClose,
  open,
  directoryId,
  idDetails,
  loggedUserId,
}) => {
  const [detailsFile, setDetailsFile] = useState<ContentFile>();
  const [editFileName, setEditFileName] = useState<Boolean>(false);
  const theme = useTheme();
  const mdDown = useMediaQuery(theme.breakpoints.down('md'));
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));

  const handleEditFileName = () => {
    setEditFileName(!editFileName);
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
          switch (axiosError.response?.data.error.name) {
            case 'EntityNotEmpty':
              showErrorAlert(EntityNotEmpty('Arquivos', 'PT-BR'));
              break;
            case 'EntityNotExists':
              showErrorAlert(EntityNotExist('Diretorio', 'PT-BR'));
              break;
            default:
              showErrorAlert(ConnectionError('PT-BR'));
              break;
          }
        }
      }
    };

    if (open) {
      getContentFile();
    }
  }, [directoryId, idDetails, loggedUserId, open]);

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
              color: 'white',
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
              Detalhes do Arquivo
            </Typography>
            <IconButton onClick={handlePopUpClose} sx={{ color: 'white' }}>
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
                    <strong>Nome do Arquivo:</strong>{' '}
                    {detailsFile?.originalName}
                  </Typography>
                </Box>
                <IconButton onClick={handleEditFileName}>
                  <EditIcon />
                </IconButton>
              </Box>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <Box
                  component="form"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'row',
                  }}
                >
                  <TextField
                    sx={{
                      width: smDown ? theme.spacing(35) : theme.spacing(60),
                    }}
                    InputProps={{
                      startAdornment: <DescriptionIcon />,
                    }}
                    size="small"
                    label="Nome do Arquivo"
                  />
                </Box>
                <IconButton onClick={handleEditFileName}>
                  <CancelIcon />
                </IconButton>
              </Box>
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
                <strong>Formato do Arquivo:</strong> {detailsFile?.format}
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
                <strong>Tamanho do Arquivo:</strong> {detailsFile?.size}
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
                <strong>Data de Upload:</strong>{' '}
                {detailsFile?.uploadDate.toString()}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};
