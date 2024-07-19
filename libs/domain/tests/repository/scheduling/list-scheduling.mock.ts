import {
  ListSchedulingDto,
  ListSchedulingReponseDto,
  ListSchedulingRepository,
} from '../../../src';
import { ListSchedulingReponseMock } from '../../entity/scheduling/list-scheduling-response.mock';

export class ListSchedulingRepositoryMock implements ListSchedulingRepository {
  inputMock = {} as ListSchedulingDto;
  async list(input: ListSchedulingDto): Promise<ListSchedulingReponseDto> {
    this.inputMock = input;
    return ListSchedulingReponseMock;
  }
}
