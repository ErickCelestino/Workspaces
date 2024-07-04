import { FC, useCallback, useEffect, useState } from 'react';
import { SimpleFormModal } from '../simple';
import {
  Box,
  MenuItem,
  TextField,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { FormButton } from '../../form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ErrorResponse,
  ListPlaylistCategoryDto,
  PlaylistBodyDto,
  PlaylistCategory,
} from '@workspaces/domain';
import { PlaylistSchema, ValidationsError } from '../../../shared';
import { useLoggedUser } from '../../../contexts';
import { ListPlaylistCategoryRequest } from '../../../services';
import axios, { AxiosError } from 'axios';

interface EditPlaylistModalProps {
  open: boolean;
  title: string;
  handlePopUpClose: () => void;
  showAlert: (message: string, success: boolean) => void;
  nameLabel?: string;
  successMessage?: string;
}

export const EditPlaylistModal: FC<EditPlaylistModalProps> = ({
  open,
  title,
  handlePopUpClose,
  showAlert,
  nameLabel = 'Nome',
  successMessage = 'Playlist Editada com Sucesso',
}) => {
  const { loggedUser } = useLoggedUser();
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState<PlaylistCategory[]>([]);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<PlaylistBodyDto>({
    mode: 'all',
    criteriaMode: 'all',
    resolver: zodResolver(PlaylistSchema),
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
          const errors = ValidationsError(axiosError, 'Category');
          if (errors) {
            showAlert(errors, false);
          }
        }
      }
    },
    [showAlert]
  );

  useEffect(() => {
    getCategories({
      loggedUserId: loggedUser?.id ?? '',
      userInput: '',
    });
  }, [loggedUser, getCategories]);

  const handlePlaylistData = async (data: PlaylistBodyDto) => {
    setLoading(true);
  };

  const handleChangeCategory = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCategoryId(event.target.value);
  };

  return (
    <SimpleFormModal
      height={smDown ? theme.spacing(55) : theme.spacing(53)}
      width={smDown ? '90%' : theme.spacing(80)}
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
          select
          fullWidth
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
