import {
  CreateContentVideoRepository,
  CreateContentVideoDto,
} from '../../../src';
import { ContentFileMock } from '../../entity';

export class CreateContentVideoRepositoryMock
  implements CreateContentVideoRepository
{
  async create(input: CreateContentVideoDto): Promise<string[]> {
    return [ContentFileMock.id];
  }
}
