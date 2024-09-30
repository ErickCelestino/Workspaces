import { Langue } from '@workspaces/domain';

export const EntityNotExist = (entity: string, langue: Langue) => {
  let message: string;

  switch (langue) {
    case 'EN':
      message = `The value ${entity} was not found in database!`;
      break;
    default:
      message = `O valor ${entity} não foi encontrado no banco!`;
      break;
  }

  return message;
};
