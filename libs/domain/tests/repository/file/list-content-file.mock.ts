import {
  ListContentFileRepository,
  ContentFile,
  ListContentFileDto,
} from '../../../src';
import { ContentFileMock } from '../../entity';

export class ListContentFileRepositoryMock
  implements ListContentFileRepository
{
  async list(input: ListContentFileDto): Promise<ContentFile[]> {
    return [ContentFileMock];
  }
}
