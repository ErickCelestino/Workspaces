import { ConsultCNPJRepository, ConsultCNPJResponse } from '@workspaces/domain';
import axios from 'axios';

export class ConsultCNPJRepositoryImpl implements ConsultCNPJRepository {
  async consult(input: string): Promise<ConsultCNPJResponse> {
    const apiUrl = `https://www.receitaws.com.br/v1/cnpj/${input}`;

    const request = await axios.get(apiUrl);

    const result =
      request.data?.status === 'ERROR'
        ? ({} as ConsultCNPJResponse)
        : request.data;

    return result;
  }
}
