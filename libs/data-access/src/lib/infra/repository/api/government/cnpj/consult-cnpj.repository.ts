import { ConsultCNPJRepository, ConsultCNPJResponse } from '@workspaces/domain';
import axios from 'axios';

export class ConsultCNPJRepositoryImpl implements ConsultCNPJRepository {
  async consult(input: string): Promise<ConsultCNPJResponse> {
    const apiUrl = `https://www.receitaws.com.br/v1/cnpj/${input}`;

    const request = await axios.get(apiUrl);
    const consult: ConsultCNPJResponse = {
      name: request.data.nome,
      district: request.data.bairro,
      email: request.data.email,
      legal_nature: request.data.natureza_juridica,
      city: request.data.municipio,
      number: request.data.numero,
      opening: request.data.abertura,
      port: request.data.porte,
      situation: request.data.situacao,
      street: request.data.bairro,
      telephone: request.data.telefone,
      uf: request.data.uf,
      zipcode: request.data.cep,
    };

    const result =
      request.data?.status === 'ERROR' ? ({} as ConsultCNPJResponse) : consult;

    return result;
  }
}
