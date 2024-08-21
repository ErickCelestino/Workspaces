import { CreateCompanyDto } from '@workspaces/domain';
import { pureTvApi } from '../axios-config';

export async function CreateCompanyRequest(input: CreateCompanyDto) {
  const result = await pureTvApi.post(
    'create-company',
    {
      fantasyName: input.body.fantasyName,
      socialReason: input.body.socialReason,
      cnpj: input.body.cnpj,
    },
    {
      params: {
        loggedUserId: input.loggedUserId,
      },
    }
  );

  return result.data;
}
