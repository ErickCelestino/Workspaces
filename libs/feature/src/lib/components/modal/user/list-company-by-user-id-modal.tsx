import { FC, useEffect, useRef } from 'react';
import { useLoggedUser } from '../../../contexts';
import { SimpleFormModal } from '../simple';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { useListCompanyData } from '../../../hooks';
import { CompanyItem, EmptyListResponse } from '../../list';
import StoreIcon from '@mui/icons-material/Store';

interface ListCompanyByUserIdModalProps {
  userId: string;
  open: boolean;
  title?: string;
  handlePopUpClose: () => void;
  showAlert: (message: string, success: boolean) => void;
}

export const ListCompanyByUserIdModal: FC<ListCompanyByUserIdModalProps> = ({
  userId,
  open,
  handlePopUpClose,
  showAlert,
  title = 'Empresas',
}) => {
  const { loggedUser } = useLoggedUser();
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));
  const hasLoadedUserData = useRef(false);

  const { listCompany, getListCompanyData } = useListCompanyData({
    showAlert,
    loggedUserId: loggedUser?.id ?? '',
  });

  useEffect(() => {
    if (!hasLoadedUserData.current) {
      getListCompanyData();
      hasLoadedUserData.current = true;
    }
  }, [getListCompanyData]);

  const renderCompanies = () =>
    listCompany.length > 0 ? (
      listCompany.map((company) => (
        <CompanyItem
          key={company.id}
          statusColor={company.status === 'ACTIVE' ? 'success' : 'error'}
          company={company}
        />
      ))
    ) : (
      <EmptyListResponse
        message="Sem Empresas"
        icon={<StoreIcon sx={{ fontSize: theme.spacing(10) }} />}
      />
    );

  return (
    <SimpleFormModal
      height={smDown ? theme.spacing(55) : theme.spacing(80)}
      width={smDown ? '90%' : theme.spacing(80)}
      open={open}
      handlePopUpClose={handlePopUpClose}
      title={title}
    >
      <Box sx={{ padding: theme.spacing(2) }}>{renderCompanies()}</Box>
    </SimpleFormModal>
  );
};
