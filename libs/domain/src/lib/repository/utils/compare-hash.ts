import { CompareHashDto } from '../../dto';

export interface CompareHashRepository {
  compare(input: CompareHashDto): Promise<boolean>;
}
