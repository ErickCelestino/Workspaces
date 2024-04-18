import { Company } from '../../entity';

export interface FilterCompanyByCnpjRepository {
  filter(input: string): Promise<Company | undefined>;
}
