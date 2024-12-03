import { Injectable } from '@nestjs/common';
import {
  CreatePreRegistration,
  CreatePreRegistrationDto,
} from '@workspaces/domain';

@Injectable()
export class CreatePreRegistrationService {
  constructor(private useCase: CreatePreRegistration) {}

  async create(input: CreatePreRegistrationDto) {
    return await this.useCase.execute(input);
  }
}
