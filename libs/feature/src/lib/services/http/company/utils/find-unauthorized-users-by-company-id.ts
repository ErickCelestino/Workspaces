import {
  FindUnauthorizedUsersByCompanyIdDto,
  UserList,
} from '@workspaces/domain';
import { generalApi } from '../../axios-config';

export async function FindUnauthorizedUsersByCompanyIdRequest(
  input: FindUnauthorizedUsersByCompanyIdDto
) {
  const result = await generalApi.get<UserList[]>(
    `find-unauthorized-users-by-company-id/${input.companyId}`,
    {
      params: {
        loggedUserId: input.loggedUserId,
      },
    }
  );
  return result.data;
}
