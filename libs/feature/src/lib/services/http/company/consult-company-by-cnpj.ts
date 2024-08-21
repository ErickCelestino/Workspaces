import {
  CompanyDataResponseDto,
  ConsultCompanyByCnpjDto,
  Device,
  FindDeviceByIdDto,
} from '@workspaces/domain';
import { generalApi } from '../axios-config';

export async function ConsultCompanyByCnpjReques(
  input: ConsultCompanyByCnpjDto
) {
  const result = await generalApi.get<CompanyDataResponseDto>(
    `consult-company-by-cnpj/${input.cnpj}`,
    {
      params: {
        loggedUserId: input.loggedUserId,
      },
    }
  );
  return result.data;
}
