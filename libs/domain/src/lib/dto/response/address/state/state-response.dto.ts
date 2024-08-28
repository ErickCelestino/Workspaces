import { CityResponseDto } from '../city-response.dto';

export interface StateResponseDto {
  id: string;
  name: string;
  uf: string;
  cities: CityResponseDto[];
}
