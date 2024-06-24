import {
  DeleteContentFileByIdDto,
  DeleteContentFileByIdRepository,
  DownloadContentFileDto,
  DownloadContentFileRepository,
} from '../../../src';

export class DownloadContentFileRepositoryMock
  implements DownloadContentFileRepository
{
  mockInput: DownloadContentFileDto = {} as DownloadContentFileDto;
  async download(input: DownloadContentFileDto): Promise<void> {
    this.mockInput = input;
  }
}
