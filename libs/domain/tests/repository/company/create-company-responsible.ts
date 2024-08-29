import {
  CreateCompanyResponsibleDto,
  CreateCompanyResponsibleRespository,
} from '../../../src';
import { CompanyResponsibleMock } from '../../entity/company';

export class CreateCompanyResponsibleRespositoryMock
  implements CreateCompanyResponsibleRespository
{
  inputMock = {} as CreateCompanyResponsibleDto;
  async create(input: CreateCompanyResponsibleDto) {
    this.inputMock = input;
    return CompanyResponsibleMock.id;
  }
}
