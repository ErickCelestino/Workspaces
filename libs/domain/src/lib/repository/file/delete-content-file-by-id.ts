import { DeleteContentFileByIdDto } from '../../dto/file/request/delete-content-file-by-id.dto';

export interface DeleteContentFileByIdRepository {
  delete(input: DeleteContentFileByIdDto): Promise<void>;
}
