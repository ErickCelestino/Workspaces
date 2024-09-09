import {
  CompanyResponsibleResponseDto,
  FindCompanyResponsibleByIdDto,
} from '@workspaces/domain';
import { generalApi } from '../../axios-config';

export async function FindCompanyResponsibleByIdRequest(
  input: FindCompanyResponsibleByIdDto
) {
  const result = await generalApi.get<CompanyResponsibleResponseDto>(
    `find-company-responsible-by-id/${input.companyResponsibleId}`,
    {
      params: {
        loggedUserId: input.loggedUserId,
      },
    }
  );
  return result.data;
}
