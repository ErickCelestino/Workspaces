import {
  Box,
  Divider,
  ListItem,
  ListItemText,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconMenuItem, ProductResponseDto } from '@workspaces/domain';
import { FC } from 'react';
import { formatBrDate } from '../../../shared';
import { ButtonFileMenu } from '../../menu';

interface ProductItemProps {
  product: ProductResponseDto;
  deleteProduct: () => Promise<void>;
  titleDescription?: string;
  titleUpdatedBy?: string;
  titleCreatedAt?: string;
}

export const ProductItem: FC<ProductItemProps> = ({
  product,
  deleteProduct,
  titleDescription = 'Descrição',
  titleUpdatedBy = 'Atualizado por',
  titleCreatedAt = 'Criado em',
}) => {
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));

  const iconMenuList: IconMenuItem[] = [
    {
      icon: <EditIcon />,
      title: 'Editar',
      handleClick: async () => {
        console.log('Editar Produto');
      },
    },
    {
      icon: <DeleteIcon />,
      title: 'Deletar',
      handleClick: deleteProduct,
    },
  ];
  return (
    <Box key={product.id}>
      <ListItem>
        <ListItemText
          primary={product.name}
          secondary={
            <Box
              component="span"
              sx={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box
                component="span"
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Box component="span">
                  <Typography
                    sx={{ display: 'inline' }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    {titleUpdatedBy}:
                  </Typography>
                  <Typography
                    sx={{ display: 'inline', marginLeft: '4px' }}
                    component="span"
                    variant="body2"
                    color="text.secondary"
                  >
                    {product.updatedBy}
                  </Typography>
                </Box>
                <Box component="span">
                  <Typography
                    sx={{ display: 'inline' }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    {titleCreatedAt}:
                  </Typography>
                  <Typography
                    sx={{ display: 'inline', marginLeft: '4px' }}
                    component="span"
                    variant="body2"
                    color="text.secondary"
                  >
                    {formatBrDate(new Date(product.createdAt))}
                  </Typography>
                </Box>
              </Box>
              <Box
                component="span"
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Typography
                  sx={{ display: 'inline' }}
                  component="span"
                  variant="body2"
                  color="text.primary"
                >
                  {titleDescription}:
                </Typography>
                <Typography
                  component="span"
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    display: 'inline-block',
                    width: '100%',
                    maxHeight: theme.spacing(6),
                    marginLeft: '4px',
                    wordWrap: 'break-word',
                    overflowY: 'auto',
                  }}
                >
                  {product.description}
                </Typography>
              </Box>
            </Box>
          }
        />
        <Box
          sx={{
            marginLeft: smDown ? 0 : theme.spacing(2),
          }}
        >
          <ButtonFileMenu iconMenuItemList={iconMenuList} />
        </Box>
      </ListItem>
      <Divider sx={{ width: '100%' }} />
    </Box>
  );
};
