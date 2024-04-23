import { Langue } from '@workspaces/domain';

export const CompanyContact = (langue: Langue) => {
  let message: string;

  switch (langue) {
    case 'EN':
      message =
        'An internal error occurred in the system, please contact the development team!';
      break;
    default:
      message =
        'Ocorreu um erro interno no sistema, por favor entrar em contato com a equipe de desenvolvimento!';
      break;
  }

  return message;
};
