import {
  CompanyDataResponseDto,
  ConsultCompanyByCnpjRepository,
  ConsultCompanyBrDto,
} from '@workspaces/domain';
import axios from 'axios';

export class ConsultCompanyByCnpjRepositoryImpl
  implements ConsultCompanyByCnpjRepository
{
  async consult(cnpj: string): Promise<CompanyDataResponseDto> {
    const url = process.env['NX_APP_CONSULT_CNPJ_URL'] ?? '';

    const response = await axios.get<ConsultCompanyBrDto>(`${url}/${cnpj}`);

    const { data } = response;
    if (!data?.cnpj) {
      return {} as CompanyDataResponseDto;
    }

    return {
      port: data.porta,
      legalNature: data.natureza_juridica,
      opening: data.abertura,
      situation: data.situacao,
    };
  }
}
