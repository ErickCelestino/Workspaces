import { ErrorMessage, Langue } from '@workspaces/domain';

export const EntityIsInvalid = (input: string, langue: Langue) => {
  let message: string;

  switch (langue) {
    case 'EN':
      message = `The ${input} is invalid!`;
      break;
    default:
      message = `A(o) ${input} é inválida!`;
      break;
  }

  return message;
};
