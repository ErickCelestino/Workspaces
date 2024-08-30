import {
  ConsultZipcodeDto,
  ConsultZipcodeRepository,
  SimpleAddressResponseDto,
  ViaCepAddressResponseDto,
} from '@workspaces/domain';
import axios from 'axios';

export class ConsultZipcodeRepositoryImpl implements ConsultZipcodeRepository {
  async consult(input: ConsultZipcodeDto): Promise<SimpleAddressResponseDto> {
    const response = await axios.get<ViaCepAddressResponseDto>(
      `https://viacep.com.br/ws/${input.zipcode}/json/`
    );

    const { data } = response;
    if (!data?.cep) {
      return {} as SimpleAddressResponseDto;
    }

    return {
      city: data.localidade,
      country: 'Brasil',
      district: data.bairro,
      state: data.uf,
      street: data.logradouro,
      zipcode: data.cep,
    };
  }
}
