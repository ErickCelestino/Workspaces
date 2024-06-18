import {
  CreateContentFileRepository,
  CreateContentFileDto,
} from '../../../src';
import { ContentFileMock } from '../../entity';

export class CreateContentFileRepositoryMock
  implements CreateContentFileRepository
{
  async create(input: CreateContentFileDto): Promise<string[]> {
    return [ContentFileMock.id];
  }
}
