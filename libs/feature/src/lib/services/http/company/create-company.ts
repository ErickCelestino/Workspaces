import { CreateCompanyDto } from '@workspaces/domain';
import { generalApi } from '../axios-config';

export async function CreateCompanyRequest(input: CreateCompanyDto) {
  const result = await generalApi.post('create-company', input);
  return result.data;
}
