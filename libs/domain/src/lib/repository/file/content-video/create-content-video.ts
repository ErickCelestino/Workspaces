import { CreateContentVideoDto } from '../../../dto';

export interface CreateContentVideoRepository {
  create(input: CreateContentVideoDto): Promise<string[]>;
}
