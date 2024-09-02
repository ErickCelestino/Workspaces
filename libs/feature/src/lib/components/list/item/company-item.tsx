import {
  Box,
  Chip,
  Divider,
  ListItem,
  ListItemText,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  IconMenuItem,
  ListSimpleCompanyResponseDto,
  StatusColor,
} from '@workspaces/domain';
import DeleteIcon from '@mui/icons-material/Delete';
import { FC } from 'react';
import { ButtonFileMenu } from '../../menu';
import { formatBrDate } from '../../../shared';

interface CompanyItemProps {
  company: ListSimpleCompanyResponseDto;
  deleteTitle?: string;
  titleCnpj?: string;
  titleFantasyName?: string;
  titleCreatedBy?: string;
  titleCreatedAt?: string;
  titleId?: string;
  titleCity?: string;
  statusTitle?: string;
  statusColor: StatusColor;
  deleteCompany: () => Promise<void>;
}

export const CompanyItem: FC<CompanyItemProps> = ({
  company,
  deleteTitle = 'Deletar',
  titleCnpj = 'CNPJ',
  titleFantasyName = 'Nome Fantasia',
  titleCreatedBy = 'Criado por',
  titleCreatedAt = 'Criado em',
  titleId = 'Cod.',
  titleCity = 'Cidade',
  statusTitle = 'Status',
  statusColor,
  deleteCompany,
}) => {
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));

  const iconMenuList: IconMenuItem[] = [
    {
      icon: <DeleteIcon />,
      title: deleteTitle,
      handleClick: deleteCompany,
    },
  ];

  return (
    <Box key={company.id}>
      <ListItem>
        <ListItemText
          primary={company.socialReason}
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
                    {titleCnpj}:
                  </Typography>
                  <Typography
                    sx={{ display: 'inline', marginLeft: theme.spacing(1) }}
                    component="span"
                    variant="body2"
                    color="text.secondary"
                  >
                    {company.cnpj}
                  </Typography>
                </Box>
                <Box component="span">
                  <Typography
                    sx={{ display: 'inline' }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    {titleFantasyName}:
                  </Typography>
                  <Typography
                    sx={{ display: 'inline', marginLeft: theme.spacing(1) }}
                    component="span"
                    variant="body2"
                    color="text.secondary"
                  >
                    {company.fantasyName}
                  </Typography>
                </Box>
              </Box>
              <Box
                component="span"
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: theme.spacing(1),
                }}
              >
                <Box component="span">
                  <Typography
                    sx={{ display: 'inline' }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    {titleId}:
                  </Typography>
                  <Typography
                    sx={{ display: 'inline', marginLeft: theme.spacing(1) }}
                    component="span"
                    variant="body2"
                    color="text.secondary"
                  >
                    {company.id}
                  </Typography>
                </Box>
                <Box component="span">
                  <Typography
                    sx={{ display: 'inline' }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    {titleCity}:
                  </Typography>
                  <Typography
                    sx={{ display: 'inline', marginLeft: theme.spacing(1) }}
                    component="span"
                    variant="body2"
                    color="text.secondary"
                  >
                    {company.city}
                  </Typography>
                </Box>
              </Box>
              <Box
                component="span"
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: theme.spacing(1),
                }}
              >
                <Box component="span">
                  <Typography
                    sx={{ display: 'inline' }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    {titleCreatedBy}:
                  </Typography>
                  <Typography
                    sx={{ display: 'inline', marginLeft: theme.spacing(1) }}
                    component="span"
                    variant="body2"
                    color="text.secondary"
                  >
                    {company.createdBy}
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
                    sx={{ display: 'inline', marginLeft: theme.spacing(1) }}
                    component="span"
                    variant="body2"
                    color="text.secondary"
                  >
                    {formatBrDate(new Date(company.createdAt))}
                  </Typography>
                </Box>
              </Box>
              <Box
                component="span"
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'end',
                  marginTop: theme.spacing(1),
                }}
              >
                <Box component="span">
                  <Typography
                    sx={{ display: 'inline' }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    {statusTitle}:
                  </Typography>
                  <Chip
                    component="span"
                    sx={{
                      marginLeft: theme.spacing(1),
                    }}
                    color={statusColor}
                    label={company.status}
                  />
                </Box>
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
