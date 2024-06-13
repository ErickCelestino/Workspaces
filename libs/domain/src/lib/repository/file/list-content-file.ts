import { ListContentFileDto } from '../../dto';
import { ContentFile } from '../../entity';

export interface ListContentFileRepository {
  list(input: ListContentFileDto): Promise<ContentFile[]>;
}
