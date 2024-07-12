import { FindDirectoryByNameDto } from '../../dto';

export interface FindDirectoryByNameRepository {
  find(input: FindDirectoryByNameDto): Promise<string>;
}
