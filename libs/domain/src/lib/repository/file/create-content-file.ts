import { CreateContentFileDto } from '../../dto';

export interface CreateContentFileRepository {
  create(input: CreateContentFileDto): Promise<string[]>;
}
