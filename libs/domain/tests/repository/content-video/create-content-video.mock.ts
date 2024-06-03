import {
  CreateContentVideoDto,
  CreateContentVideoRepository,
} from '../../../src';

export class CreateContentVideoRepositoryMock
  implements CreateContentVideoRepository
{
  async create(input: CreateContentVideoDto): Promise<void> {
    return undefined;
  }
}
