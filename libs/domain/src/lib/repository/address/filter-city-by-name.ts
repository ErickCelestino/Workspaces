import { City } from '../../entity';

export interface FilterCityByNameRepository {
  filter(input: string): Promise<City>;
}
