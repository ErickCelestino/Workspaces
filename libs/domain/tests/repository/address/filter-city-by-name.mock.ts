import { City, FilterCityByNameRepository } from '../../../src';
import { CityMock } from '../../entity/address/city.mock';

export class FilterCityByRepositoryMock implements FilterCityByNameRepository {
  async filter(_input: string): Promise<City> {
    return CityMock;
  }
}
