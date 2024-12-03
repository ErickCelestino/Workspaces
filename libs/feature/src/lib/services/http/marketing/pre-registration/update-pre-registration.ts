import { UpdatePreRegistrationDto } from '@workspaces/domain';
import { pureMaketingApi } from '../../axios-config';

export async function UpdatePreRegistrationRequest(
  input: UpdatePreRegistrationDto
) {
  const result = await pureMaketingApi.put<{ preRegisrationId: string }>(
    `update-pre-registration/${input.id}`,
    {
      branchOfTheCompany: input.branchOfTheCompany,
    }
  );
  return result.data;
}
