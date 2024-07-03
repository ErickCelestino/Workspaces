import {
  Box,
  MenuItem,
  TextField,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { FC, useCallback, useEffect, useState } from 'react';
import { SimpleFormModal } from '../simple';
import { CreatePlaylistSchema, ValidationsError } from '../../../shared';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormButton } from '../../form';
import { useLoggedUser } from '../../../contexts';
import {
  CreatePlaylistDto,
  ErrorResponse,
  ListPlaylistCategoryDto,
  PlaylistCategory,
} from '@workspaces/domain';
import {
  CreatePlaylistRequest,
  ListPlaylistCategoryRequest,
} from '../../../services';
import axios, { AxiosError } from 'axios';

interface CreatePlaylistModalProps {
  open: boolean;
  title: string;
  handlePopUpClose: () => void;
  showAlert: (message: string, success: boolean) => void;
  nameLabel?: string;
  successMessage?: string;
}

interface CratePlaylistBody {
  name: string;
  playlistCategoryId: string;
}

export const CreatePlaylistModal: FC<CreatePlaylistModalProps> = ({
  handlePopUpClose,
  showAlert,
  title,
  open,
  nameLabel = 'Nome',
  successMessage = 'Playlist Cadastrada com Sucesso',
}) => {
  const { loggedUser } = useLoggedUser();
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));
  const mdDown = useMediaQuery(theme.breakpoints.down('md'));
  const [categories, setCategories] = useState<PlaylistCategory[]>([]);
  const [categoryId, setCategoryId] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<CratePlaylistBody>({
    mode: 'all',
    criteriaMode: 'all',
    resolver: zodResolver(CreatePlaylistSchema),
    defaultValues: {
      name: '',
      playlistCategoryId: '',
    },
  });

  const getCategories = useCallback(
    async (input: ListPlaylistCategoryDto) => {
      try {
        const result = await ListPlaylistCategoryRequest(input);
        setCategories(result.categories);
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

  const createPlaylist = async (data: CreatePlaylistDto) => {
    try {
      const result = await CreatePlaylistRequest(data);

      if (result) {
        setSuccess(true);
        setLoading(false);
        showAlert(successMessage, true);
        handlePopUpClose();
      }
    } catch (error) {
      setSuccess(false);
      setLoading(false);
      console.error(error);
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        const errors = ValidationsError(axiosError, 'Playlist');
        if (errors) {
          showAlert(errors, false);
        }
      }
    }
  };

  useEffect(() => {
    getCategories({
      loggedUserId: loggedUser?.id ?? '',
      userInput: '',
    });
  }, [loggedUser, getCategories]);

  const handlePlaylistData = async (data: CratePlaylistBody) => {
    setLoading(true);
    await createPlaylist({
      loggedUserId: loggedUser?.id ?? '',
      name: data.name,
      playlistCategoryId: categoryId,
    });
  };

  const handleChangeCategory = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCategoryId(event.target.value);
  };

  return (
    <SimpleFormModal
      open={open}
      handlePopUpClose={handlePopUpClose}
      title={title}
    >
      <Box
        sx={{ mt: 2 }}
        component="form"
        onSubmit={handleSubmit(handlePlaylistData)}
      >
        <TextField
          margin="normal"
          required
          fullWidth
          error={!!errors.name}
          helperText={errors.name?.message}
          id="name"
          disabled={loading}
          label={nameLabel}
          autoComplete="name"
          autoFocus
          {...register('name')}
        />

        <TextField
          sx={{
            width: smDown
              ? '100%'
              : mdDown
              ? theme.spacing(45)
              : theme.spacing(30),
          }}
          select
          value={categoryId}
          margin="normal"
          error={!!errors.playlistCategoryId}
          helperText={errors.playlistCategoryId?.message}
          id="playlistCategoryId"
          label="Categoria"
          {...register('playlistCategoryId', {
            onChange: handleChangeCategory,
          })}
        >
          {categories.map((item) => (
            <MenuItem key={item.id} value={item.id}>
              {item.name}
            </MenuItem>
          ))}
        </TextField>

        <FormButton
          buttonTitle="Registrar"
          loading={loading}
          success={success}
        />
      </Box>
    </SimpleFormModal>
  );
};
