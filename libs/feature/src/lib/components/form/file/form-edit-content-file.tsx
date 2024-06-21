import {
  Box,
  IconButton,
  TextField,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import DescriptionIcon from '@mui/icons-material/Description';
import SendIcon from '@mui/icons-material/Send';
import { FC } from 'react';
import { EditContentFileRequest } from '../../../services';
import {
  EntityNotEmpty,
  EntityNotExist,
  ConnectionError,
  EditContentFileSchema,
} from '../../../shared';
import { EditContentFileDto, ErrorResponse } from '@workspaces/domain';
import { useForm } from 'react-hook-form';
import axios, { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';

interface FormEditContentFileProps {
  handleEditFileName: () => void;
  showErrorAlert: (message: string) => void;
  onEditSuccess: () => void;
  directoryId: string;
  idToEdit: string;
  loggedUserId: string;
}

export const FormEditContentFile: FC<FormEditContentFileProps> = ({
  handleEditFileName,
  showErrorAlert,
  onEditSuccess,
  directoryId,
  idToEdit,
  loggedUserId,
}) => {
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<{ newFileName: string }>({
    mode: 'all',
    resolver: zodResolver(EditContentFileSchema),
    criteriaMode: 'all',
    defaultValues: {
      newFileName: '',
    },
  });

  const editFileName = async (data: { newFileName: string }) => {
    try {
      const dto: EditContentFileDto = {
        directoryId,
        idToEdit,
        loggedUserId,
        newFileName: data.newFileName,
      };
      const result = await EditContentFileRequest(dto);
      onEditSuccess();
      return result;
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

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}
      component="form"
      onSubmit={handleSubmit(editFileName)}
    >
      <Box
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
          error={!!errors.newFileName}
          helperText={errors.newFileName?.message}
          id="newFileName"
          {...register('newFileName')}
          autoComplete="newFileName"
        />
      </Box>
      <IconButton onClick={handleEditFileName}>
        <CancelIcon />
      </IconButton>
      <Box
        sx={{
          display: 'flex',
          position: 'relative',
          flexDirection: 'column',
        }}
      >
        <IconButton onClick={handleSubmit(editFileName)}>
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
};
