import { ConsultCNPJResponse } from '../../../entity';

export interface ConsultCNPJRepository {
  consult(input: string): Promise<ConsultCNPJResponse>;
}
