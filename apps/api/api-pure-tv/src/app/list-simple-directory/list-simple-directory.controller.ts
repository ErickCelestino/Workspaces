import { Controller } from '@nestjs/common';
import { ListSimpleDirectoryService } from './list-simple-directory.service';

@Controller('list-simple-directory')
export class ListSimpleDirectoryController {
  constructor(
    private readonly listSimpleDirectoryService: ListSimpleDirectoryService
  ) {}
}
