import { ListContentFileDto } from '../../dto';
import { File } from '../../entity';

export interface ListContentFileRepository {
  list(input: ListContentFileDto): Promise<File[]>;
}
