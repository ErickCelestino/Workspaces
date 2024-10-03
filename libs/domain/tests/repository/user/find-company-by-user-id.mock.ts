import {
  CompanyResponseDto,
  FindCompanyByUserIdRepository,
} from '../../../src';
import { CompanyMock } from '../../entity';

export class FindCompanyByUserIdRepositoryMock
  implements FindCompanyByUserIdRepository
{
  inputMock = '';
  async find(userId: string): Promise<CompanyResponseDto[]> {
    this.inputMock = userId;
    return [CompanyMock, CompanyMock];
  }
}
