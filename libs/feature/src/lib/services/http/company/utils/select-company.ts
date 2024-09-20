import { SelectCompanyDto } from '@workspaces/domain';
import { generalApi } from '../../axios-config';

export async function SelectCompanyRequest(input: SelectCompanyDto) {
  const result = await generalApi.post<{ companyId: string }>(
    `select-company/${input.companyId}`,
    {
      params: {
        loggedUserId: input.loggedUserId,
      },
    }
  );
  return result.data;
}
