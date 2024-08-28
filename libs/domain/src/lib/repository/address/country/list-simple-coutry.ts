import {
  ListSimpleCountryDto,
  ListSimpleCountryResponseDto,
} from '../../../dto';

export interface ListSimpleCountryRepository {
  list(input: ListSimpleCountryDto): Promise<ListSimpleCountryResponseDto[]>;
}
