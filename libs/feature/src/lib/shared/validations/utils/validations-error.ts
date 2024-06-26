import { ErrorResponse } from '@workspaces/domain';
import { AxiosError } from 'axios';
import {
  ConnectionError,
  EntityExist,
  EntityNotAllowed,
  EntityNotCreated,
  EntityNotEmpty,
} from '../../messages';

export function ValidationsError(
  errors: AxiosError<ErrorResponse>,
  entitie: string
) {
  switch (errors.response?.data.error.name) {
    case 'EntityNotEmpty':
      return EntityNotEmpty(entitie, 'PT-BR');

    case 'EntityNotCreated':
      return EntityNotCreated(entitie, 'PT-BR');

    case 'FileNotAllowed':
      return EntityNotAllowed(entitie, 'PT-BR');

    default:
      return ConnectionError('PT-BR');
  }
}
