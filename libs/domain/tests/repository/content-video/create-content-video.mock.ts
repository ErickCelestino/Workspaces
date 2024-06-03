import {
  CreateContentVideoDto,
  CreateContentVideoRepository,
} from '../../../src';
import { ContentVideoMock } from '../../entity';

export class CreateContentVideoRepositoryMock
  implements CreateContentVideoRepository
{
  async create(input: CreateContentVideoDto): Promise<string> {
    return ContentVideoMock.id;
  }
}
