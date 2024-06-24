import { UploadFileDto, UploadFileRepository } from '../../../src';

export class UploadFileRespositoryMock implements UploadFileRepository {
  inputMock = {} as UploadFileDto;
  async upload(input: UploadFileDto): Promise<void> {
    this.inputMock = input;
  }
}
