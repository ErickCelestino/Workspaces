import { Langue } from '@workspaces/domain';

export const InvalidEmail = (langue: Langue) => {
  let message: string;

  switch (langue) {
    case 'EN':
      message = 'The e-mail is invalid';
      break;
    default:
      message = 'O e-mail é inválido';
      break;
  }
  return message;
};
