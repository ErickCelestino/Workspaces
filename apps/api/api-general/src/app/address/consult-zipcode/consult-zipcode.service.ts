import { Injectable } from '@nestjs/common';
import { ConsultZipcode, ConsultZipcodeDto } from '@workspaces/domain';

@Injectable()
export class ConsultZipcodeService {
  constructor(private useCase: ConsultZipcode) {}

  async consult(input: ConsultZipcodeDto) {
    return await this.useCase.execute(input);
  }
}
