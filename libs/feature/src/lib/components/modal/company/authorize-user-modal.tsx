import { useLoggedUser } from '../../../contexts';
import { SimpleConfimationModal } from '../simple';
import { FC } from 'react';
import { ErrorResponse } from '@workspaces/domain';
import { AuthorizeUserToCompanyRequest } from '../../../services';
import axios, { AxiosError } from 'axios';
import { ValidationsError } from '../../../shared';

interface AuthorizeUserModalProps {
  idToAuthorized: string;
  title: string;
  subTitle?: string;
  successMessage?: string;
  open: boolean;
  handlePopUpClose: () => void;
  showAlert: (message: string, success: boolean) => void;
}

export const AuthorizeUserModal: FC<AuthorizeUserModalProps> = ({
  idToAuthorized,
  open,
  title,
  handlePopUpClose,
  showAlert,
  subTitle,
  successMessage = 'Usuário autorizado com sucesso!',
}) => {
  const { loggedUser } = useLoggedUser();

  const authorizeUser = async () => {
    try {
      const result = await AuthorizeUserToCompanyRequest({
        companyId: loggedUser?.selectedCompany.id ?? '',
        loggedUserId: loggedUser?.id ?? '',
        userId: idToAuthorized,
      });
      if (result) {
        showAlert(successMessage, true);
        handlePopUpClose();
      }
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        const errors = ValidationsError(axiosError, 'Empresa');
        if (errors) {
          showAlert(errors, false);
        }
      }
    }
  };

  return (
    <SimpleConfimationModal
      onClose={handlePopUpClose}
      open={open}
      subTitle={subTitle ?? ''}
      title={title}
      onSuccess={authorizeUser}
    />
  );
};
