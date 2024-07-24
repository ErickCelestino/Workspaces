import { EditSchedulingDto, EditSchedulingRepository } from '../../../src';

export class EditSchedulingRepositoryMock implements EditSchedulingRepository {
  inputMock = {} as EditSchedulingDto;
  async edit(input: EditSchedulingDto): Promise<void> {
    this.inputMock = input;
  }
}
