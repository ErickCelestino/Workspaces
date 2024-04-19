import { Company, FilterCompanyByCnpjRepository } from '../../../src';

export class FilterCompanyByCnpjRepositoryMock
  implements FilterCompanyByCnpjRepository
{
  async filter(input: string): Promise<Company | undefined> {
    return undefined;
  }
}
