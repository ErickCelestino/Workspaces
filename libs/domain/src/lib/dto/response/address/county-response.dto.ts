import { StateResponseDto } from './state-response.dto';

export interface CountryResponseDto {
  id: string;
  name: string;
  uf: string;
  states: StateResponseDto[];
}
