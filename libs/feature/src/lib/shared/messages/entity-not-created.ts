import { Langue } from '@workspaces/domain';

export const EntityNotCreated = (entity: string, langue: Langue) => {
  let message: string;

  switch (langue) {
    case 'EN':
      message = `the ${entity} was not registered`;
      break;
    default:
      message = `A(o) ${entity} não pode ser cadastrada!`;
      break;
  }

  return message;
};
