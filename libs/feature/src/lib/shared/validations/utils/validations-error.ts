import { ErrorResponse } from '@workspaces/domain';
import { AxiosError } from 'axios';
import {
  ConnectionError,
  EntityAlreadyExists,
  EntityNotAllowed,
  EntityNotConverted,
  EntityNotCreated,
  EntityNotEmpty,
  EntityNotNegativeNumber,
  NotPermission,
  StartTimeCannotBeGreaterEndTime,
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

    case 'EntityAlreadyExists':
      return EntityAlreadyExists(entitie, 'PT-BR');

    case 'EntityNotConverted':
      return EntityNotConverted(entitie, 'PT-BR');

    case 'StartTimeCannotBeGreaterEndTime':
      return StartTimeCannotBeGreaterEndTime('PT-BR');

    case 'EntityNotNegativeNumber':
      return EntityNotNegativeNumber(entitie, 'PT-BR');

    case 'NotPermissionError':
      return NotPermission('PT-BR');

    default:
      return ConnectionError('PT-BR');
  }
}
