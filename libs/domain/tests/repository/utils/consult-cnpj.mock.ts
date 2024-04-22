import { ConsultCNPJRepository, ConsultCNPJResponse } from '../../../src';
import { ConsultCnpjMock } from '../../entity';

export class ConsultCNPJRepositoryMock implements ConsultCNPJRepository {
  async consult(_input: string): Promise<ConsultCNPJResponse> {
    return ConsultCnpjMock;
  }
}
